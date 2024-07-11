package controllers

import (
    "github.com/gofiber/fiber/v2"

    "strconv"
	
    "dex_pa/prisma/db"
)

func GetAllUsers(client *db.PrismaClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        users, err := client.User.FindMany().Exec(c.Context())
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(users)
    }
}

func CreateUser(client *db.PrismaClient) fiber.Handler {
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

func GetUser(client *db.PrismaClient) fiber.Handler {
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

func UpdateUser(client *db.PrismaClient) fiber.Handler {
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

func DeleteUser(client *db.PrismaClient) fiber.Handler {
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
