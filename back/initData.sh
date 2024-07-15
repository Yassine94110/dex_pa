#!/bin/bash

# URL de base de l'API
BASE_URL="http://localhost:3001"

# Données des utilisateurs
USERS=(
    '{"address":"0x1234567890abcdef","username":"user1"}'
    '{"address":"0x234567890abcdef1","username":"user2"}'
    '{"address":"0x34567890abcdef12","username":"user3"}'
    '{"address":"0x4567890abcdef123","username":"user4"}'
    '{"address":"0x567890abcdef1234","username":"user5"}'
)

# Données des tokens
TOKENS=(
    '{"address":"0xabcdef1234567890","name":"Token1","ticker":"TK1","supply":"1000"}'
    '{"address":"0xbcdef1234567890a","name":"Token2","ticker":"TK2","supply":"2000"}'
    '{"address":"0xcdef1234567890ab","name":"Token3","ticker":"TK3","supply":"3000"}'
    '{"address":"0xdef1234567890abc","name":"Token4","ticker":"TK4","supply":"4000"}'
    '{"address":"0xef1234567890abcd","name":"Token5","ticker":"TK5","supply":"5000"}'
)

# Fonction pour envoyer une requête POST
send_post_request() {
    URL=$1
    DATA=$2
    curl -X POST -H "Content-Type: application/json" -d "$DATA" "$URL"
}

# Seed users
for USER in "${USERS[@]}"; do
    send_post_request "$BASE_URL/user" "$USER"
done

# Seed tokens
for TOKEN in "${TOKENS[@]}"; do
    send_post_request "$BASE_URL/token" "$TOKEN"
done

echo "Database seeded successfully via API."
