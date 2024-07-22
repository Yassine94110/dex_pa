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
)

# Données des tokens
TOKENS=(
    '{"address":"0x0528E0979F18d5BA324e96191e6A661A3f3965fc","name":"GalaxySwapProtocol","ticker":"GST","supply":"1000000000000"}'
    '{"address":"0x90766C298A1d46998aaDBA3A9F8Bd92De86beE8a","name":"Solstice","ticker":"SOL","supply":"1000000000000"}'
    '{"address":"0x8Ce482A07115A46861a7c75e9Fb00D8AB335FFA1","name":"Nebula","ticker":"NBL","supply":"1000000000000"}'
    '{"address":"0xd1b86B54B3eFC8f1d8e7a414c26b85803F358BDe","name":"Aether","ticker":"AET","supply":"1000000000000"}'
    '{"address":"0x5eb2b36Ca72e6372769d287AA828F4Ee50734b95","name":"Zephyr","ticker":"ZPH","supply":"1000000000000"}'
    '{"address":"0xF6E91E639e95e79bdf5f710EA27f224723F886d7","name":"Lumin","ticker":"LMN","supply":"1000000000000"}'
    '{"address":"0xfBF7E5a22d608ab8F89cA8Fc00BE626927e14A0B","name":"Orion","ticker":"ORN","supply":"1000000000000"}'
    '{"address":"0x838411108a7996f35Aa2cfF1F5d271B202679750","name":"Phoenix","ticker":"PHX","supply":"1000000000000"}'
    '{"address":"0x5825B56fe9DC5aB16dB07EbE34956E1b633a132F","name":"Aurora","ticker":"AUR","supply":"1000000000000"}'
    '{"address":"0xaf3dc32b3ae94bff4FcfDDfe1052AD83d62C982C","name":"Celestia","ticker":"CLT","supply":"1000000000000"}'
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
