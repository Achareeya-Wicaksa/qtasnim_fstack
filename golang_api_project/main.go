package main

import (
    "golang_api_project/config"
    "golang_api_project/controllers"
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func main() {

	config.ConnectDB()

    r := gin.Default()

    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, 
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"}, 
        AllowHeaders:     []string{"Content-Type", "Authorization"}, 
        AllowCredentials: true, 
    }))

    // API routes
    r.POST("/items", controllers.CreateItem)
    r.GET("/items", controllers.GetItems)
    r.GET("/items/:id", controllers.GetItem)
    r.PUT("/items/:id", controllers.UpdateItem)
    r.DELETE("/items/:id", controllers.DeleteItem)

    r.Run(":8080") 
}
