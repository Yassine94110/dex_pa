package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"os"
	"strings"

	"dex_pa/prisma/db"

	"github.com/gofiber/fiber/v2"
)

const swapExecutedTopic = "0x764f0dc063c06f32d89a3f3af80c0db4be8a090901f589a478b447e0a51f09f1"

type JSONRPCRequest struct {
	JSONRPC string        `json:"jsonrpc"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
	ID      int           `json:"id"`
}

type JSONRPCResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	Result  json.RawMessage `json:"result"`
	ID      int             `json:"id"`
	Error   *RPCError       `json:"error,omitempty"`
}

type RPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type Log struct {
	Address          string   `json:"address"`
	Topics           []string `json:"topics"`
	Data             string   `json:"data"`
	BlockNumber      string   `json:"blockNumber"`
	TransactionHash  string   `json:"transactionHash"`
	TransactionIndex string   `json:"transactionIndex"`
	BlockHash        string   `json:"blockHash"`
	LogIndex         string   `json:"logIndex"`
	Removed          bool     `json:"removed"`
}

func getLogs(fromBlock, toBlock, address string, topics []string) ([]Log, error) {
	infuraURL := os.Getenv("INFURA_URL")

	params := map[string]interface{}{
		"fromBlock": fromBlock,
		"toBlock":   toBlock,
		"address":   address,
	}
	if len(topics) > 0 {
		params["topics"] = topics
	}

	request := JSONRPCRequest{
		JSONRPC: "2.0",
		Method:  "eth_getLogs",
		Params:  []interface{}{params},
		ID:      1,
	}

	requestData, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("erreur de sérialisation de la requête: %v", err)
	}

	resp, err := http.Post(infuraURL, "application/json", bytes.NewBuffer(requestData))
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la requête HTTP: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("erreur de lecture de la réponse: %v", err)
	}

	var rpcResponse JSONRPCResponse
	err = json.Unmarshal(body, &rpcResponse)
	if err != nil {
		return nil, fmt.Errorf("erreur de désérialisation de la réponse: %v", err)
	}

	if rpcResponse.Error != nil {
		return nil, fmt.Errorf("erreur de la RPC: %v", rpcResponse.Error.Message)
	}

	var logs []Log
	err = json.Unmarshal(rpcResponse.Result, &logs)
	if err != nil {
		return nil, fmt.Errorf("erreur de désérialisation des logs: %v", err)
	}

	return logs, nil
}

func hexToBigInt(hexStr string) *big.Int {
	i := new(big.Int)
	i.SetString(hexStr[2:], 16)
	return i
}

func padAddress(address string) string {
	address = strings.ToLower(strings.TrimPrefix(address, "0x"))
	return "0x" + strings.Repeat("0", 64-len(address)) + address
}

func GetAnalytics(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		fromBlock := "0x5fb619" // Bloc 6282585 en hexadécimal
		toBlock := "latest"     // Jusqu'au bloc le plus récent
		address := os.Getenv("CONTRACT_ADDRESS")
		topics := []string{swapExecutedTopic} // Topic de l'event SwapExecuted

		logs, err := getLogs(fromBlock, toBlock, address, topics)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		swapCount := 0
		totalAmountIn := new(big.Int)
		totalAmountOut := new(big.Int)

		for _, log := range logs {
			if len(log.Topics) > 0 && log.Topics[0] == swapExecutedTopic {
				swapCount++
				data := log.Data
				if len(data) >= 256 {
					amountIn := hexToBigInt(data[130:194])
					amountOut := hexToBigInt(data[194:258])
					totalAmountIn.Add(totalAmountIn, amountIn)
					totalAmountOut.Add(totalAmountOut, amountOut)
				}
			}
		}

		totalSwapped := new(big.Int).Add(totalAmountIn, totalAmountOut)
		feesGenerated := new(big.Float).Mul(new(big.Float).SetInt64(int64(swapCount)), big.NewFloat(0.001))

		return c.JSON(fiber.Map{
			"swapCount":     swapCount,
			"totalSwapped":  totalSwapped.String(),
			"feesGenerated": feesGenerated.String(),
		})
	}
}

func GetAnalyticsByAddress(client *db.PrismaClient) fiber.Handler {
	return func(c *fiber.Ctx) error {
		fromBlock := "0x5fb619" // Bloc 6282585 en hexadécimal
		toBlock := "latest"     // Jusqu'au bloc le plus récent
		address := os.Getenv("CONTRACT_ADDRESS")
		userAddress := padAddress(c.Params("address"))

		logs, err := getLogs(fromBlock, toBlock, address, []string{swapExecutedTopic, userAddress})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		swapCount := 0
		totalAmountIn := new(big.Int)
		totalAmountOut := new(big.Int)

		for _, log := range logs {
			if len(log.Topics) > 0 && log.Topics[0] == swapExecutedTopic {
				swapCount++
				data := log.Data
				if len(data) >= 256 {
					amountIn := hexToBigInt(data[130:194])
					amountOut := hexToBigInt(data[194:258])
					totalAmountIn.Add(totalAmountIn, amountIn)
					totalAmountOut.Add(totalAmountOut, amountOut)
				}
			}
		}

		totalSwapped := new(big.Int).Add(totalAmountIn, totalAmountOut)
		feesGenerated := new(big.Float).Mul(new(big.Float).SetInt64(int64(swapCount)), big.NewFloat(0.001))

		return c.JSON(fiber.Map{
			"swapCount":     swapCount,
			"totalSwapped":  totalSwapped.String(),
			"feesGenerated": feesGenerated.String(),
		})
	}
}
