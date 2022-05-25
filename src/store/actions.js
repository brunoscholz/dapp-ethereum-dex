import Web3 from 'web3/dist/web3.min.js'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'

export function web3Loaded(connection) {
  return {
    type: 'WEB3_LOADED',
    payload: connection
  }
}

export function web3AccountLoaded(account) {
  return {
    type: 'WEB3_ACCOUNT_LOADED',
    payload: account
  }
}

export const loadWeb3 = dispatch => {
  // const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545')
  const web3 = new Web3('ws://localhost:7545')
  dispatch({ type: 'WEB3_LOADED', payload: web3 })
  return web3
}

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts()
  dispatch({ type: 'WEB3_ACCOUNT_LOADED', payload: accounts[0] })
  return accounts[0]
}

export const loadToken = async (web3, networkId, dispatch) => {
  try {
    const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
    dispatch({ type: 'TOKEN_LOADED', payload: token })
    return token
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with metamask')
    return null
  }
}

export const loadExchange = async (web3, networkId, dispatch) => {
  try {
    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
    dispatch({ type: 'EXCHANGE_LOADED', payload: exchange })
    return exchange
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with metamask')
    return null
  }
}

export const loadAllOrders = async (exchange, dispatch) => {
  // fetch cancelled orders with the 'Cancel' event stream
  const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' })
  const cancelledOrders = cancelStream.map(event => event.returnValues)
  dispatch({ type: 'CANCELLED_ORDERS_LOADED', payload: cancelledOrders })

  // fetch filled orders with the 'Trade' event stream
  const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' })
  const filledOrders = tradeStream.map(event => event.returnValues)
  dispatch({ type: 'FILLED_ORDERS_LOADED', payload: filledOrders })

  // fetch all orders with the 'Order' event stream
  const orderStream = await exchange.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' })
  const allOrders = orderStream.map(event => event.returnValues)
  dispatch({ type: 'ALL_ORDERS_LOADED', payload: allOrders })
}
