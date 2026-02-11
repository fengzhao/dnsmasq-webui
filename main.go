package main

import (
	"context"
	"embed"
	"encoding/json"
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

//go:embed index.html index.tsx *.ts types.ts translations.ts components/*.tsx services/*.ts
var staticFiles embed.FS

var (
	ConfigPath          = getEnv("DNSMASQ_CONF", "/etc/dnsmasq.conf")
	Port                = getEnv("PORT", ":3000")
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

// 通过 Docker Unix Socket 重启指定的容器
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
	resp := StatusResponse{
		Active:          true,
		Uptime:          "Running",
		CPU:             0.5,
		Memory:          48.2,
		PID:             os.Getpid(),
		Connected:       true,
		Mode:            "docker-remote",
		TargetContainer: DockerRestartTarget,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		content, err := os.ReadFile(ConfigPath)
		if err != nil {
			http.Error(w, "Failed to read config", 500)
			return
		}
		w.Write(content)
		return
	}

	if r.Method == http.MethodPost {
		body, _ := io.ReadAll(r.Body)
		err := os.WriteFile(ConfigPath, body, 0644)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(Response{Success: err == nil})
	}
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
	os.WriteFile(tmpFile, body, 0644)
	defer os.Remove(tmpFile)

	// 使用本地安装的 dnsmasq 进行语法测试
	cmd := exec.Command(DnsmasqBin, "--test", "--conf-file="+tmpFile)
	output, err := cmd.CombinedOutput()
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"valid": err == nil,
		"error": string(output),
	})
}

func main() {
	mux := http.NewServeMux()
	
	// API 路由
	mux.HandleFunc("/api/status", handleStatus)
	mux.HandleFunc("/api/restart", handleRestart)
	mux.HandleFunc("/api/config", handleConfig)
	mux.HandleFunc("/api/test-config", handleTestConfig)

	// 静态资源路由
	contentStatic, _ := fs.Sub(staticFiles, ".")
	fileServer := http.FileServer(http.FS(contentStatic))

	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// API 请求不经过此路由
		if strings.HasPrefix(r.URL.Path, "/api") {
			return
		}

		// 处理 React/ESM 路由：如果请求的是特定 TSX 文件，确保 MIME 类型正确（某些浏览器需要）
		if strings.HasSuffix(r.URL.Path, ".tsx") {
			w.Header().Set("Content-Type", "application/javascript")
		}
		if strings.HasSuffix(r.URL.Path, ".ts") {
			w.Header().Set("Content-Type", "application/javascript")
		}

		fileServer.ServeHTTP(w, r)
	}))

	log.Printf("Dnsmasq Admin Pro 启动成功！监听端口 %s\n", Port)
	log.Printf("管理配置文件: %s\n", ConfigPath)
	log.Printf("重启目标容器: %s\n", DockerRestartTarget)
	
	server := &http.Server{
		Addr:         Port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	
	log.Fatal(server.ListenAndServe())
}
