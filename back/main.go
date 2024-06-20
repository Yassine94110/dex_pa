package main

import (
	"log"

	"dex_pa/prisma/db"

	"github.com/gofiber/fiber/v2"
)

func main() {
	client := db.NewClient()
	err := client.Prisma.Connect()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer client.Prisma.Disconnect()

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	// Routes for users
	app.Get("/user", getAllUsers(client))
	app.Post("/user", createUser(client))
	app.Get("/user/:id", getUser(client))
	app.Put("/user/:id", updateUser(client))
	app.Delete("/user/:id", deleteUser(client))

	// Routes for tokens
	app.Get("/token", getAllTokens(client))
	app.Post("/token", addToken(client))
	app.Get("/token/:address", getToken(client))
	app.Put("/token/:address", updateToken(client))
	app.Delete("/token/:address", deleteToken(client))

	log.Println("Server is starting on port 3001...")

	log.Fatal(app.Listen(":3001"))
}
