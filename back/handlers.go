package main

import (
	"dex_pa/prisma/db"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func getAllUsers(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		users, err := client.User.FindMany().Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(users)
	}
}

func createUser(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var input struct {
			Address  string `json:"address"`
			Username string `json:"username"`
		}
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		user, err := client.User.CreateOne(
			db.User.Address.Set(input.Address),
			db.User.Username.Set(input.Username),
		).Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusCreated).JSON(user)
	}
}

func getUser(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}
		user, err := client.User.FindUnique(db.User.ID.Equals(id)).Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.JSON(user)
	}
}

func updateUser(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}
		var input struct {
			Address  string `json:"address"`
			Username string `json:"username"`
		}
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		user, err := client.User.FindUnique(db.User.ID.Equals(id)).Update(
			db.User.Address.Set(input.Address),
			db.User.Username.Set(input.Username),
		).Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(user)
	}
}

func deleteUser(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
		}
		_, err = client.User.FindUnique(db.User.ID.Equals(id)).Delete().Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "User deleted"})
	}
}

func getAllTokens(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokens, err := client.Token.FindMany().Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(tokens)
	}
}

func addToken(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var input struct {
			Address string `json:"address"`
		}
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		token, err := client.Token.CreateOne(
			db.Token.Address.Set(input.Address),
		).Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(fiber.StatusCreated).JSON(token)
	}
}

func getToken(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		address := c.Params("address")
		token, err := client.Token.FindUnique(db.Token.Address.Equals(address)).Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Token not found"})
		}
		return c.JSON(token)
	}
}

func updateToken(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		address := c.Params("address")
		var input struct {
			Address string `json:"address"`
		}
		if err := c.BodyParser(&input); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
		}
		token, err := client.Token.FindUnique(db.Token.Address.Equals(address)).Update(
			db.Token.Address.Set(input.Address),
		).Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(token)
	}
}

func deleteToken(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		address := c.Params("address")
		_, err := client.Token.FindUnique(db.Token.Address.Equals(address)).Delete().Exec(c.Context())
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}
		return c.JSON(fiber.Map{"status": "Token deleted"})
	}
}
