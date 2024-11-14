package main

import (
    "golang_api_project/config"
    "golang_api_project/controllers"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {

	config.ConnectDB()

    // Initialize Gin router
    r := gin.Default()

    // CORS configuration
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, // Frontend URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"}, // Allowed HTTP methods
        AllowHeaders:     []string{"Content-Type", "Authorization"}, // Allowed headers
        AllowCredentials: true, // Allow cookies if needed
    }))

    // API routes
    r.POST("/items", controllers.CreateItem)
    r.GET("/items", controllers.GetItems)
    r.GET("/items/:id", controllers.GetItem)
    r.PUT("/items/:id", controllers.UpdateItem)
    r.DELETE("/items/:id", controllers.DeleteItem)

    // Start the server
    r.Run(":8080") // Default port 8080
}
