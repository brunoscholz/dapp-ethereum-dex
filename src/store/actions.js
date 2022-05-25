import Web3 from 'web3/dist/web3.min.js'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import { ETHER_ADDRESS } from '../helpers'

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
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:7545')
  // const web3 = new Web3('ws://localhost:7545')
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

export const subscribeToEvents = async (exchange, dispatch) => {
  exchange.events.Cancel({}, (error, event) => {
    dispatch({ type: 'ORDER_CANCELLED', payload: event.returnValues })
  })
  exchange.events.Trade({}, (error, event) => {
    dispatch({ type: 'ORDER_FILLED', payload: event.returnValues })
  })
  exchange.events.Deposit({}, (error, event) => {
    // dispatch({ type: 'BALANCES_LOADED' })
  })
}

export const cancelOrder = (exchange, order, account, dispatch) => {
  exchange.methods.cancelOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch({ type: 'ORDER_CANCELLING' })
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
}

export const fillOrder = (exchange, order, account, dispatch) => {
  exchange.methods.fillOrder(order.id).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch({ type: 'ORDER_FILLING' })
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
}

export const loadBalances = async (web3, exchange, token, account, dispatch) => {
  // ether balance in wallet
  const etherBalance = await web3.eth.getBalance(account)
  dispatch({ type: 'ETHER_BALANCE_LOADED', payload: etherBalance })

  // token balance in wallet
  const tokenBalance = await token.methods.balanceOf(account).call()
  dispatch({ type: 'TOKEN_BALANCE_LOADED', payload: tokenBalance })

  // ether balance in exchange
  const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
  dispatch({ type: 'EXCHANGE_ETHER_BALANCE_LOADED', payload: exchangeEtherBalance })

  // token balance in exchange
  const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call()
  dispatch({ type: 'EXCHANGE_TOKEN_BALANCE_LOADED', payload: exchangeTokenBalance })

  dispatch({ type: 'BALANCES_LOADED' })
}

export const depositEther = (conn, exchange, token, account, amount, dispatch) => {
  exchange.methods.depositEther().send({ from: account, value: Web3.utils.toWei(amount, 'ether') })
    .on('transactionHash', (hash) => {
      dispatch({ type: 'BALANCES_LOADING' })
      loadBalances(conn, exchange, token, account, dispatch)
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
}

export const withdrawEther = (conn, exchange, token, account, amount, dispatch) => {
  exchange.methods.withdrawEther(Web3.utils.toWei(amount, 'ether')).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch({ type: 'BALANCES_LOADING' })
      loadBalances(conn, exchange, token, account, dispatch)
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
}

export const depositToken = (conn, exchange, token, account, amount, dispatch) => {
  amount = Web3.utils.toWei(amount ?? 0, 'ether')

  token.methods.approve(exchange.options.address, amount).send({ from: account })
    .on('transactionHash', (hash) => {
      exchange.methods.depositToken(token.options.address, amount).send({ from: account })
      .on('transactionHash', (hash) => {
        dispatch({ type: 'BALANCES_LOADING' })
        loadBalances(conn, exchange, token, account, dispatch)
      })
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
}

export const withdrawToken = (conn, exchange, token, account, amount, dispatch) => {
  amount = Web3.utils.toWei(amount ?? 0, 'ether')

  exchange.methods.withdrawToken(token.options.address, amount).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch({ type: 'BALANCES_LOADING' })
      loadBalances(conn, exchange, token, account, dispatch)
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
}
