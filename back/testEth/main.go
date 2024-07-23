package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
)

const infuraURL = "https://sepolia.infura.io/v3/10641427c6714f2784e2467206e5fadb"
const contractAddress = "0x3747365453363a80d2f182d44db5a361dE3F7300"
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
	fmt.Println("Préparation des paramètres de la requête...")
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

	fmt.Println("Sérialisation de la requête JSON...")
	requestData, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("erreur de sérialisation de la requête: %v", err)
	}

	fmt.Printf("Requête JSON: %s\n", string(requestData))

	fmt.Println("Envoi de la requête HTTP POST...")
	resp, err := http.Post(infuraURL, "application/json", bytes.NewBuffer(requestData))
	if err != nil {
		return nil, fmt.Errorf("erreur lors de la requête HTTP: %v", err)
	}
	defer resp.Body.Close()

	fmt.Println("Lecture de la réponse...")
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("erreur de lecture de la réponse: %v", err)
	}

	fmt.Printf("Réponse brute: %s\n", string(body))

	fmt.Println("Désérialisation de la réponse JSON...")
	var rpcResponse JSONRPCResponse
	err = json.Unmarshal(body, &rpcResponse)
	if err != nil {
		return nil, fmt.Errorf("erreur de désérialisation de la réponse: %v", err)
	}

	fmt.Println("Vérification des erreurs dans la réponse...")
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

func main() {
	fmt.Println("Démarrage du script...")
	fromBlock := "0x5fb619" // Bloc 6282585 en hexadécimal
	toBlock := "latest"     // Jusqu'au bloc le plus récent
	address := contractAddress
	topics := []string{swapExecutedTopic} // Topic de l'event SwapExecuted

	logs, err := getLogs(fromBlock, toBlock, address, topics)
	if err != nil {
		fmt.Printf("Erreur: %v\n", err)
		return
	}

	fmt.Printf("Nombre de logs récupérés: %d\n", len(logs))

	swapCount := 0
	totalAmountIn := new(big.Int)
	totalAmountOut := new(big.Int)

	for _, log := range logs {
		fmt.Printf("Traitement du log: %+v\n", log)
		if len(log.Topics) > 0 && log.Topics[0] == swapExecutedTopic {
			swapCount++
			data := log.Data
			fmt.Printf("Data du log: %s\n", data)
			if len(data) >= 128 {
				amountIn := hexToBigInt(data[2:66])
				amountOut := hexToBigInt(data[66:130])
				totalAmountIn.Add(totalAmountIn, amountIn)
				totalAmountOut.Add(totalAmountOut, amountOut)
				fmt.Printf("amountIn: %s, amountOut: %s\n", amountIn.String(), amountOut.String())
			} else {
				fmt.Println("Data du log est trop court pour contenir amountIn et amountOut.")
			}
		} else {
			fmt.Println("Log n'est pas un SwapExecuted.")
		}
	}

	fmt.Printf("Nombre total de swaps: %d\n", swapCount)
	fmt.Printf("Montant total de tokens échangés (amountIn): %s\n", totalAmountIn.String())
	fmt.Printf("Montant total de tokens reçus (amountOut): %s\n", totalAmountOut.String())

	fmt.Println("Script terminé.")
}
