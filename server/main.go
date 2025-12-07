package main

import (
	"log"
	"net/http"

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

	// Start server
	port := ":8080"
	log.Printf("Backend API server starting on http://localhost%s", port)
	log.Printf("This is the API proxy - do NOT visit this URL directly")
	log.Printf("Visit http://localhost:3000 in your browser instead")
	log.Printf("Proxying requests to: https://platform.zone01.gr")

	if err := http.ListenAndServe(port, corsHandler); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
