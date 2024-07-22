package main

import (
	"log"

	controllers "dex_pa/controllers"
	"dex_pa/prisma/db"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Charger les variables d'environnement
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	client := db.NewClient()
	err = client.Prisma.Connect()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer client.Prisma.Disconnect()

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	// Routes for users
	app.Get("/user", controllers.GetAllUsers(client))
	app.Post("/user", controllers.CreateUser(client))
	app.Get("/user/:id", controllers.GetUser(client))
	app.Put("/user/:id", controllers.UpdateUser(client))
	app.Delete("/user/:id", controllers.DeleteUser(client))

	// Routes for tokens
	app.Get("/token", controllers.GetAllTokens(client))
	app.Post("/token", controllers.AddToken(client))
	app.Get("/token/:address", controllers.GetToken(client))
	app.Put("/token/:address", controllers.UpdateToken(client))
	app.Delete("/token/:address", controllers.DeleteToken(client))

	// Routes for analytics
	app.Get("/analytics", controllers.GetAnalytics(client))
	app.Get("/analytics/:address", controllers.GetAnalyticsByAddress(client))

	log.Println("Server is starting on port 3001...")

	log.Fatal(app.Listen(":3001"))
}
