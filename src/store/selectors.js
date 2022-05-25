import { get, groupBy, maxBy, minBy, reject } from 'lodash'
import moment from 'moment'
import { createSelector } from 'reselect'

import { ETHER_ADDRESS, GREEN, RED, tokens, ether, formatBalance } from '../helpers'

const web3 = state => get(state, 'web3')
export const web3Selector = createSelector(web3, w => w)

const account = state => get(state, 'account')
export const accountSelector = createSelector(account, a => a)

const tokenLoaded = state => get(state, 'token.loaded')
export const tokenLoadedSelector = createSelector(tokenLoaded, loaded => loaded)

const tokenContract = state => get(state, 'token.contract')
export const tokenSelector = createSelector(tokenContract, t => t)

const exchangeLoaded = state => get(state, 'exchange.loaded')
export const exchangeLoadedSelector = createSelector(exchangeLoaded, loaded => loaded)

const exchangeContract = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchangeContract, xl => xl)

const allOrdersLoaded = state => get(state, 'exchange.orders.loaded', false)
export const allOrdersLoadedSelector = createSelector(allOrdersLoaded, loaded => loaded)

const allOrders = state => get(state, 'exchange.orders.data', [])
export const allOrdersSelector = createSelector(allOrders, xl => xl)

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false)
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

const filledOrders = state => get(state, 'exchange.filledOrders.data', [])
export const filledOrdersSelector = createSelector(filledOrders, orders => {
  // sort orders by date ascending for price comparison
  orders = orders.sort((a, b) => a.timestamp - b.timestamp)

  orders = decorateFilledOrders(orders)

  // sort the orders by date descending for display
  orders = orders.sort((a, b) => b.timestamp - a.timestamp)
  return orders
})

const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, loaded => loaded)

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(cancelledOrders, xl => xl)

// const contractLoaded = state => tokenLoaded(state) && exchangeLoaded(state)
export const contractLoadedSelector = createSelector(tokenLoaded, exchangeLoaded, (tl, xl) => tl && xl)

const decorateFilledOrders = orders => {
  let previousOrder = orders[0]
  return orders.map(order => {
    order = decorateOrder(order)
    order = decorateFilledOrder(order, previousOrder)
    previousOrder = order
    return order
  })
}

const decorateOrder = order => {
  let etherAmount
  let tokenAmount
  if (order.tokenGive === ETHER_ADDRESS) {
    etherAmount = ether(order.amountGive)
    tokenAmount = tokens(order.amountGet)
  } else {
    etherAmount = ether(order.amountGet)
    tokenAmount = tokens(order.amountGive)
  }

  let tokenPrice = etherAmount / tokenAmount
  let precision = 10000
  tokenPrice = Math.round(tokenPrice * precision) / precision

  return {
    ...order,
    etherAmount: etherAmount,
    tokenAmount: tokenAmount,
    tokenPrice: tokenPrice,
    formatedTimestamp: moment.unix(order.timestamp).format('hh:mm:ss a M/D')
  }
}

const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    tokenClassPrice: tokenClassPrice(order.tokenPrice, order.id, previousOrder)
  }
}

const tokenClassPrice = (tokenPrice, orderId, previousOrder) => {
  if (previousOrder.id === orderId) {
    return GREEN
  }

  if (previousOrder.tokenPrice <= tokenPrice) {
    return GREEN
  } else {
    return RED
  }
}

const openOrders = state => {
  const all = allOrders(state)
  const filled = filledOrders(state)
  const cancelled = cancelledOrders(state)

  return reject(all, order => {
    const orderFilled = filled.some(o => o.id === order.id)
    const orderCancelled = cancelled.some(o => o.id === order.id)
    return orderFilled || orderCancelled
  })
}

const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state)
export const orderBookLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)

export const orderBookSelector = createSelector(openOrders, orders => {
  // decorate the orders
  orders = decorateOrderBookOrders(orders)
  // group orders by orderType
  orders = groupBy(orders, 'orderType')

  // fetch buy orders
  const buyOrders = get(orders, 'buy', [])
  // sort buy orders by tokenPrice
  orders = {
    ...orders,
    buyOrders: buyOrders.sort((a, b) => b.timestamp - a.timestamp)
  }

  // fetch sell orders
  const sellOrders = get(orders, 'sell', [])
  // sort sell orders by tokenPrice
  orders = {
    ...orders,
    sellOrders: sellOrders.sort((a, b) => a.timestamp - b.timestamp)
  }

  return orders
})

const decorateOrderBookOrders = orders => {
  return orders.map(order => {
    order = decorateOrder(order)
    order = decorateOrderBookOrder(order)
    return order
  })
}

const decorateOrderBookOrder = order => {
  let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  return {
    ...order,
    orderType: orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
    orderFillAction: orderType === 'buy' ? 'sell' : 'buy',
  }
}

export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)
export const myFilledOrdersSelector = createSelector(account, filledOrders, (account, filledOrders) => {
  // find our orders
  let orders = filledOrders.filter(o => o.user === account || o.userFill === account)
  // sort by date ascending
  orders = orders.sort((a,b) => a.timestamp - b.timestamp)
  // decorate orders
  orders = decorateMyFilledOrders(orders, account)
  return orders
})

const decorateMyFilledOrders = (orders, account) => {
  return orders.map(order => {
    order = decorateOrder(order)
    order = decorateMyFilledOrder(order, account)
    return order
  })
}

const decorateMyFilledOrder = (order, account) => {
  const myOrder = order.user === account

  let orderType
  if (myOrder) {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  } else {
    orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
  }

  return {
    ...order,
    orderType: orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
    orderSign: orderType === 'buy' ? '+' : '-'
  }
}

export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded)
export const myOpenOrdersSelector = createSelector(account, openOrders, (account, openOrders) => {
  // filter orders created by current account
  let orders = openOrders.filter(o => o.user === account)
  // decorate orders
  orders = decorateMyOpenOrders(orders, account)
  // sort by date descending
  orders = orders.sort((a,b) => b.timestamp - a.timestamp)

  return orders
})

const decorateMyOpenOrders = (orders, account) => {
  return orders.map(order => {
    order = decorateOrder(order)
    order = decorateMyOpenOrder(order, account)
    return order
  })
}

const decorateMyOpenOrder = (order, account) => {
  let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

  return {
    ...order,
    orderType: orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED
  }
}

export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded)

export const priceChartSelector = createSelector(filledOrders, (orders) => {
  // sort ascending to compare history
  orders = orders.sort((a,b) => b.timestamp - a.timestamp)
  // decorate the orders
  orders = orders.map(order => decorateOrder(order))

  // get last 2 orders for final price and price change
  let secondLastOrder, lastOrder
  [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)

  const lastPrice = get(lastOrder, 'tokenPrice', 0)
  const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)


  return ({
    lastPrice: lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? '+' : '-',
    series: [{
      data: buildGraphData(orders)
    }]
  })
})

const buildGraphData = (orders) => {
  // group the orders by hour
  orders = groupBy(orders, (o) => moment.unix(o.timestamp).startOf('hour').format())
  // get each hour where data exists
  const hours = Object.keys(orders)
  // build the graph series
  const graphData = hours.map(hour => {
    const group = orders[hour]
    // calculate price values - open, high, low, close
    const open = group[0]
    const close = group[group.length - 1]
    const high = maxBy(group, 'tokenPrice')
    const low = minBy(group, 'tokenPrice')
    return ({
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
    })
  })
  return graphData
}

const orderCancelling = state => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(orderCancelling, loaded => loaded)

const orderFilling = state => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(orderFilling, loaded => loaded)

const balancesLoading = state => get(state, 'exchange.balancesLoading', true)
export const balancesLoadingSelector = createSelector(balancesLoading, status => status)

const etherBalance = state => get(state, 'balance', 0)
export const etherBalanceSelector = createSelector(etherBalance, (balance) => {
  return formatBalance(balance)
})

const tokenBalance = state => get(state, 'token.balance', 0)
export const tokenBalanceSelector = createSelector(tokenBalance, (balance) => {
  return formatBalance(balance)
})

const exchangeEtherBalance = state => get(state, 'exchange.etherBalance', 0)
export const exchangeEtherBalanceSelector = createSelector(exchangeEtherBalance, (balance) => {
  return formatBalance(balance)
})

const exchangeTokenBalance = state => get(state, 'exchange.tokenBalance', 0)
export const exchangeTokenBalanceSelector = createSelector(exchangeTokenBalance, (balance) => {
  return formatBalance(balance)
})

const etherDepositAmount = state => get(state, 'exchange.etherDepositAmount', null)
export const etherDepositAmountSelector = createSelector(etherDepositAmount, amount => amount)

const etherWithdrawAmount = state => get(state, 'exchange.etherWithdrawAmount', null)
export const etherWithdrawAmountSelector = createSelector(etherWithdrawAmount, amount => amount)

const tokenDepositAmount = state => get(state, 'exchange.tokenDepositAmount', null)
export const tokenDepositAmountSelector = createSelector(tokenDepositAmount, amount => amount)

const tokenWithdrawAmount = state => get(state, 'exchange.tokenWithdrawAmount', null)
export const tokenWithdrawAmountSelector = createSelector(tokenWithdrawAmount, amount => amount)