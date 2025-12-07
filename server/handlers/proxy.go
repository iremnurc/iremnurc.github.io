package handlers

import (
	"bytes"
	"io"
	"log"
	"net/http"
)

const (
	authEndpoint    = "https://platform.zone01.gr/api/auth/signin"
	graphqlEndpoint = "https://platform.zone01.gr/api/graphql-engine/v1/graphql"
)

// proxyRequest forwards an HTTP request to the target endpoint and returns the response
func proxyRequest(w http.ResponseWriter, r *http.Request, targetURL string, requestBody io.Reader, logPrefix string) {
	// Validate method
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header required", http.StatusUnauthorized)
		return
	}

	// Create request to target endpoint
	proxyReq, err := http.NewRequest("POST", targetURL, requestBody)
	if err != nil {
		log.Printf("%s: Error creating request: %v", logPrefix, err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Forward headers
	proxyReq.Header.Set("Authorization", authHeader)
	proxyReq.Header.Set("Content-Type", "application/json")

	// Execute request
	client := &http.Client{}
	resp, err := client.Do(proxyReq)
	if err != nil {
		log.Printf("%s: Error executing request: %v", logPrefix, err)
		http.Error(w, "Failed to connect to service", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("%s: Error reading response: %v", logPrefix, err)
		http.Error(w, "Failed to read response", http.StatusInternalServerError)
		return
	}

	// Forward response to client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)

	// Only log errors and important requests (not every successful request)
	if resp.StatusCode >= 400 {
		log.Printf("%s: ERROR status=%d, size=%d bytes", logPrefix, resp.StatusCode, len(respBody))
	}
}

// ProxyAuthHandler handles authentication requests
func ProxyAuthHandler(w http.ResponseWriter, r *http.Request) {
	proxyRequest(w, r, authEndpoint, nil, "Auth request")
}

// ProxyGraphQLHandler handles GraphQL requests
func ProxyGraphQLHandler(w http.ResponseWriter, r *http.Request) {
	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("GraphQL request: Error reading request body: %v", err)
		http.Error(w, "Failed to read request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	proxyRequest(w, r, graphqlEndpoint, bytes.NewReader(body), "GraphQL request")
}
