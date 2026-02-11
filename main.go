
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

const (
	ConfigPath = "/etc/dnsmasq.conf"
	Port       = ":3000"
)

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Log     string `json:"log,omitempty"`
}

type StatusResponse struct {
	Active    bool    `json:"active"`
	Uptime    string  `json:"uptime"`
	CPU       float64 `json:"cpu"`
	Memory    float64 `json:"memory"`
	PID       int     `json:"pid"`
	Connected bool    `json:"connected"`
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	cmd := exec.Command("systemctl", "is-active", "dnsmasq")
	err := cmd.Run()
	isActive := err == nil
	
	var pid int
	pidCmd := exec.Command("pgrep", "dnsmasq")
	out, _ := pidCmd.Output()
	fmt.Sscanf(string(out), "%d", &pid)

	resp := StatusResponse{
		Active:    isActive,
		Uptime:    "Running",
		CPU:       0.8,
		Memory:    32.2,
		PID:       pid,
		Connected: true,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleRestart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	cmd := exec.Command("sudo", "systemctl", "restart", "dnsmasq")
	output, err := cmd.CombinedOutput()
	json.NewEncoder(w).Encode(Response{Success: err == nil, Log: string(output)})
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	body, _ := io.ReadAll(r.Body)
	err := os.WriteFile(ConfigPath, body, 0644)
	json.NewEncoder(w).Encode(Response{Success: err == nil, Message: err.Error()})
}

func handleTestConfig(w http.ResponseWriter, r *http.Request) {
	body, _ := io.ReadAll(r.Body)
	tmpFile := "/tmp/dnsmasq_test.conf"
	os.WriteFile(tmpFile, body, 0644)
	defer os.Remove(tmpFile)

	cmd := exec.Command("dnsmasq", "--test", "--conf-file="+tmpFile)
	output, err := cmd.CombinedOutput()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"valid": err == nil,
		"error": string(output),
	})
}

func main() {
	if runtime.GOOS == "windows" {
		log.Println("Warning: This tool is designed for Linux systems.")
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/status", handleStatus)
	mux.HandleFunc("/api/restart", handleRestart)
	mux.HandleFunc("/api/config", handleConfig)
	mux.HandleFunc("/api/test-config", handleTestConfig)

	fileServer := http.FileServer(http.Dir("."))
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/api") {
			fileServer.ServeHTTP(w, r)
			return
		}
	}))

	log.Printf("Dnsmasq Admin Pro started on %s\n", Port)
	log.Fatal(http.ListenAndServe(Port, enableCORS(mux)))
}
