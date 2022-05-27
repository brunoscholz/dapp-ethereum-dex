# Live preview

[Descentralized Token Exchange](https://dapp-bootcamp1.herokuapp.com/). You need metamask wallet / browser extension with some Ether on Goerli Test Network.

## Running the Project

  * Use Node 12.x
  * Download and install [Ganache](https://trufflesuite.com/ganache/)
  * Download and install [Metamask](https://metamask.io/download/)

Import the first ganache account into metamask, add the local ganache network in metamask.

```
git clone https://github.com/brunoscholz/dapp-ethereum-dex.git
cd dapp-ethereum-dex
npm install
```

Compile and deploy the contracts to your local testnet.
```
truffle compile
truffle migrate
```

If you want to seed the exchange with some data, run:
```
truffle exec scripts/seed-exchange.js
```

### `truffle test`

You can run the contract tests to see if everything is wired up correctly.\
It will test Token and Exchange Solidity Contracts.


### `npm start`

Runs the application in development mode on [http://localhost:3000](http://localhost:3000).\
Connect the imported account on metamask to the web page and you can test it.
