package models

import "time"

type Item struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	Name           string    `json:"name"`
	Stock          int       `json:"stock"`
	Sold           int       `json:"sold"`
	TransactionDate time.Time `json:"transaction_date"`
	Category       string    `json:"category"`
}
