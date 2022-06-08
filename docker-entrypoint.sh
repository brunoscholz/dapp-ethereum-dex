#!/bin/sh
set -e

echo "Running docker-entrypoint.sh in DEVELOPMENT mode"

echo "Compiling contracts"
./node_modules/truffle compile

echo "Running contract tests"
./node_modules/truffle test

echo "Deploying contracts to the blockchain"
./node_modules/truffle migrate

echo "Seeding the exchange"
./node_modules/truffle exec scripts/seed-exchange.js

echo "Start dev mode on port 4001"
npm start

exec "$@"