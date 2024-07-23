#!/bin/bash

# URL de base de l'API
BASE_URL="http://localhost:3001"

# Données des utilisateurs
USERS=(
    '{"address":"0x1234567890abcdef","username":"user1"}'
    '{"address":"0x234567890abcdef1","username":"user2"}'
    '{"address":"0x34567890abcdef12","username":"user3"}'
    '{"address":"0x4567890abcdef123","username":"user4"}'
    '{"address":"0xA21039F3c7ba23C1fC14BBD59481e0E7f085C68d","username":"Hamza"}'
    '{"address":"0xE1E71b5FeA42cBa159fF3f12C4C104eE38a33a2F","username":"TheoAdmin"}'
    '{"address":"0x1232627c42266AfE57626da09948B6ED55C899C0","username":"Teyiko"}'
)

# Données des tokens
TOKENS=(
    '{"address":"0x5c93f0B18B60C4850Fdda62494c364F7A4517B67","name":"GalaxySP","ticker":"GST","supply":"1000000000000000000000000000000"}'
    '{"address":"0x382F6400b170061AF23cE52B701CC52617e2A5A7","name":"Solstice","ticker":"SOL","supply":"1000000000000000000000000000000"}'
    '{"address":"0x183C7F30eeFCd6381260812a7e64b4e5E41a4911","name":"Nebula","ticker":"NBL","supply":"1000000000000000000000000000000"}'
    '{"address":"0xc1C0F5060F26E2E55E1B0dD67E3CE8566c5Fd8aD","name":"Aether","ticker":"AET","supply":"1000000000000000000000000000000"}'
    '{"address":"0xaF4Fed9a5cf79E870799E03F62D563238820C814","name":"Zephyr","ticker":"ZPH","supply":"1000000000000000000000000000000"}'
    '{"address":"0x0c85734202EC06115B0Cec648E6DA281E118Fad9","name":"Lumin","ticker":"LMN","supply":"1000000000000000000000000000000"}'
    '{"address":"0x91f5A1a6203ACEA3bd90ecF8C94a23968973f3Bc","name":"Orion","ticker":"ORN","supply":"1000000000000000000000000000000"}'
    '{"address":"0x6C3b05d0515C8b078AACc4699375B05279b4446d","name":"Phoenix","ticker":"PHX","supply":"1000000000000000000000000000000"}'
    '{"address":"0xAaF96b248fe974412C2854C11EbCbEe3B7bc9303","name":"Aurora","ticker":"AUR","supply":"1000000000000000000000000000000"}'
    '{"address":"0x585aAf71Dfc198c7C075D2A6f9D079A347bCf8a8","name":"Celestia","ticker":"CLT","supply":"1000000000000000000000000000000"}'
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
