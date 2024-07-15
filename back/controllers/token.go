package controllers

import (
    "github.com/gofiber/fiber/v2"
    "dex_pa/prisma/db"
)

func GetAllTokens(client *db.PrismaClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        tokens, err := client.Token.FindMany().Exec(c.Context())
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(tokens)
    }
}

func AddToken(client *db.PrismaClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        var input struct {
            Address string `json:"address"`
            Name    string `json:"name"`
            Ticker  string `json:"ticker"`
            Supply  string `json:"supply"`
        }
        if err := c.BodyParser(&input); err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
        }
        token, err := client.Token.CreateOne(
            db.Token.Address.Set(input.Address),
            db.Token.Name.Set(input.Name),
            db.Token.Ticker.Set(input.Ticker),
            db.Token.Supply.Set(input.Supply),
        ).Exec(c.Context())
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        return c.Status(fiber.StatusCreated).JSON(token)
    }
}

func GetToken(client *db.PrismaClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        address := c.Params("address")
        token, err := client.Token.FindUnique(db.Token.Address.Equals(address)).Exec(c.Context())
        if err != nil {
            return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Token not found"})
        }
        return c.JSON(token)
    }
}

func UpdateToken(client *db.PrismaClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        address := c.Params("address")
        var input struct {
            Name   string `json:"name"`
            Ticker string `json:"ticker"`
            Supply string `json:"supply"`
        }
        if err := c.BodyParser(&input); err != nil {
            return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
        }
        token, err := client.Token.FindUnique(db.Token.Address.Equals(address)).Update(
            db.Token.Name.Set(input.Name),
            db.Token.Ticker.Set(input.Ticker),
            db.Token.Supply.Set(input.Supply),
        ).Exec(c.Context())
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(token)
    }
}

func DeleteToken(client *db.PrismaClient) fiber.Handler {
    return func(c *fiber.Ctx) error {
        address := c.Params("address")
        _, err := client.Token.FindUnique(db.Token.Address.Equals(address)).Delete().Exec(c.Context())
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
        }
        return c.JSON(fiber.Map{"status": "Token deleted"})
    }
}
