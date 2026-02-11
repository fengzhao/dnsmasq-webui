package main

import (
	"context"
	"embed"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"
)

//go:embed index.html *.tsx components/*.tsx services/*.ts types.ts
var staticFiles embed.FS

var (
	ConfigPath          = getEnv("DNSMASQ_CONF", "/etc/dnsmasq.conf")
	DefaultPort         = getEnv("PORT", ":3000")
	DnsmasqBin          = getEnv("DNSMASQ_BIN", "dnsmasq")
	DockerRestartTarget = getEnv("DOCKER_RESTART_TARGET", "")
)

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Log     string `json:"log,omitempty"`
}

type StatusResponse struct {
	Active          bool    `json:"active"`
	Uptime          string  `json:"uptime"`
	CPU             float64 `json:"cpu"`
	Memory          float64 `json:"memory"`
	PID             int     `json:"pid"`
	Connected       bool    `json:"connected"`
	Mode            string  `json:"mode"`
	TargetContainer string  `json:"target_container"`
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func restartDockerContainer(containerName string) error {
	dialer := net.Dialer{Timeout: 5 * time.Second}
	httpClient := http.Client{
		Transport: &http.Transport{
			DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
				return dialer.Dial("unix", "/var/run/docker.sock")
			},
		},
	}
	url := fmt.Sprintf("http://localhost/v1.41/containers/%s/restart", containerName)
	resp, err := httpClient.Post(url, "application/json", nil)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("docker api error: %s", string(body))
	}
	return nil
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	mode := "host"
	if DockerRestartTarget != "" {
		mode = "docker-remote"
	}
	resp := StatusResponse{
		Active:          true,
		Uptime:          "Running",
		CPU:             0.2,
		Memory:          42.5,
		PID:             os.Getpid(),
		Connected:       true,
		Mode:            mode,
		TargetContainer: DockerRestartTarget,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	body, _ := io.ReadAll(r.Body)
	err := os.WriteFile(ConfigPath, body, 0644)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Success: err == nil})
}

func handleRestart(w http.ResponseWriter, r *http.Request) {
	var err error
	if DockerRestartTarget != "" {
		err = restartDockerContainer(DockerRestartTarget)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Success: err == nil})
}

func handleTestConfig(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)
	tmpFile := "/tmp/dnsmasq_test.conf"
	_ = os.WriteFile(tmpFile, body, 0644)
	defer os.Remove(tmpFile)

	cmd := exec.Command(DnsmasqBin, "--test", "--conf-file="+tmpFile)
	output, err := cmd.CombinedOutput()
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"valid": err == nil,
		"error": string(output),
	})
}

func main() {
	// --- 命令行参数解析 ---
	serverAddr := flag.String("server", DefaultPort, "HTTP service address (e.g. :3000)")
	flag.Parse()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/status", handleStatus)
	mux.HandleFunc("/api/restart", handleRestart)
	mux.HandleFunc("/api/config", handleConfig)
	mux.HandleFunc("/api/test-config", handleTestConfig)

	// 静态文件服务
	contentStatic, _ := fs.Sub(staticFiles, ".")
	fileServer := http.FileServer(http.FS(contentStatic))

	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api") {
			return
		}
		// 所有的资源请求（如 .tsx, .ts, .html）均通过嵌入的 FS 提供
		fileServer.ServeHTTP(w, r)
	}))

	log.Printf("Dnsmasq Admin Pro (Embedded) started on %s\n", *serverAddr)
	log.Printf("Config Path: %s\n", ConfigPath)
	
	server := &http.Server{
		Addr:    *serverAddr,
		Handler: mux,
	}
	log.Fatal(server.ListenAndServe())
}
