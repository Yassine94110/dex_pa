package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/Yassine94110/dex_pa/back/db"
	"github.com/joho/godotenv"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Handle DB connection
	prisma, err := db.ConnectDB()
	if err != nil {
		database_url := os.Getenv("DATABASE_URL")
		fmt.Println("database_url variable : ", database_url)
		log.Fatal("Cannot connect to database")
	}
	// Defer disconnect until program stops
	defer prisma.Client.Disconnect()

	// create a wallet
	wallets := []string{"0x123456789"}
	createdWallet, err := prisma.Client.User.CreateOne(
		db.User.Wallets.Set(wallets),
	).Exec(prisma.Context)
	if err != nil {
		return err
	}

	result, _ := json.MarshalIndent(createdWallet, "", "  ")
	fmt.Printf("created post: %s\n", result)

	// find a single post
	wallet, err := prisma.Client.User.FindUnique(
		db.User.ID.Equals(createdWallet.ID),
	).Exec(prisma.Context)
	if err != nil {
		return err
	}

	result, _ = json.MarshalIndent(wallet, "", "  ")
	fmt.Printf("post: %s\n", result)

	desc := wallet.Role

	fmt.Printf("The posts's description is: %s\n", desc)

	return nil
}
