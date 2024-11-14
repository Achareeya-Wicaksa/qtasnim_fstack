package controllers

import (
	"golang_api_project/config"
	"golang_api_project/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateItem(c *gin.Context) {
	var item models.Item
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Create(&item)
	c.JSON(http.StatusOK, item)
}

func GetItems(c *gin.Context) {
	var items []models.Item

	name := c.Query("name")
	if name != "" {
		config.DB = config.DB.Where("name LIKE ?", "%"+name+"%")
	}

	startDate := c.Query("start_date")
	endDate := c.Query("end_date")
	if startDate != "" && endDate != "" {
		start, _ := time.Parse("2006-01-02", startDate)
		end, _ := time.Parse("2006-01-02", endDate)
		config.DB = config.DB.Where("transaction_date BETWEEN ? AND ?", start, end)
	}

	sortBy := c.Query("sort_by")
	if sortBy != "" {
		config.DB = config.DB.Order(sortBy)
	}

	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func GetItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	c.JSON(http.StatusOK, item)
}

func UpdateItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

func DeleteItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	config.DB.Delete(&item)
	c.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}
