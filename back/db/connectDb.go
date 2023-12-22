package db

import (
	"context"
)

type PrismaDB struct {
	Client  *PrismaClient
	Context context.Context
}

var PClient = &PrismaDB{}

func ConnectDB() (*PrismaDB, error) {
	client := NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return nil, err
	}

	PClient.Client = client
	PClient.Context = context.Background()
	return PClient, nil
}
