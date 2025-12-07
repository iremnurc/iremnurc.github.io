package main

import (
	"log"
	"net/http"
	"os"

	"graphql-proxy/handlers"
	"graphql-proxy/middleware"
)

func main() {
	// Create a new ServeMux
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/api/auth/signin", handlers.ProxyAuthHandler)
	mux.HandleFunc("/api/graphql", handlers.ProxyGraphQLHandler)

	// Wrap with CORS middleware
	corsHandler := middleware.CORS(mux)

	// Start server - use PORT environment variable for cloud platforms
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	port = ":" + port

	log.Printf("Backend API server starting on port %s", port)
	log.Printf("Proxying requests to: https://platform.zone01.gr")

	if err := http.ListenAndServe(port, corsHandler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
