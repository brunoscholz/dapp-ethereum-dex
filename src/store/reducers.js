export const initialState = {
  web3: null,
  account: null,
  token: null,
  exchange: null,
  wallet: null
}

export const web3Reducer = (state, action) => {
  switch (action.type) {
    case 'WEB3_LOADED':
      return {
        ...state,
        web3: action.payload
      }
    case 'WEB3_ACCOUNT_LOADED':
      return {
        ...state,
        account: action.payload
      }
    case 'ETHER_BALANCE_LOADED':
      return {
        ...state,
        balance: action.payload
      }
    default:
      return state
  }
}

export const tokenReducer = (state, action) => {
  switch (action.type) {
    case 'TOKEN_LOADED':
      return {
        ...state,
        token: {
          ...state.token,
          loaded: true,
          contract: action.payload
        }
      }
    case 'TOKEN_BALANCE_LOADED':
      return {
        ...state,
        token: {
          ...state.token,
          balance: action.payload
        }
      }
    default:
      return state
  }
}

export const exchangeReducer = (state, action) => {
  let index, data
  switch (action.type) {
    case 'EXCHANGE_LOADED':
      return {
        ...state,
        exchange: {
          loaded: true,
          contract: action.payload
        }
      }
    case 'CANCELLED_ORDERS_LOADED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          cancelledOrders: {
            loaded: true,
            data: action.payload
          }
        }
      }
    case 'FILLED_ORDERS_LOADED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          filledOrders: {
            loaded: true,
            data: action.payload
          }
        }
      }
    case 'ALL_ORDERS_LOADED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          orders: {
            loaded: true,
            data: action.payload
          }
        }
      }
    case 'ORDER_CANCELLING':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          orderCancelling: true
        }
      }
    case 'ORDER_CANCELLED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          orderCancelling: false,
          cancelledOrders: {
            ...state.exchange.cancelledOrders,
            data: [
              ...state.exchange.cancelledOrders.data,
              action.payload
            ]
          }
        }
      }
    case 'ORDER_FILLING':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          orderFilling: true
        }
      }
    case 'ORDER_FILLED':
      index = state.exchange.filledOrders.data.findIndex(order => order.id === action.payload.id)
      data = state.exchange.filledOrders.data
      if (index === -1) {
        data = [
          ...state.exchange.filledOrders.data,
          action.payload
        ]
      }
      return {
        ...state,
        exchange: {
          ...state.exchange,
          orderFilling: false,
          filledOrders: {
            ...state.exchange.filledOrders,
            data: data
          }
        }
      }

    case 'EXCHANGE_ETHER_BALANCE_LOADED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          etherBalance: action.payload
        }
      }

    case 'EXCHANGE_TOKEN_BALANCE_LOADED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          tokenBalance: action.payload
        }
      }

    case 'BALANCES_LOADED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          balancesLoading: false
        }
      }

    case 'BALANCES_LOADING':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          balancesLoading: true
        }
      }

    case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          etherDepositAmount: action.payload
        }
      }
    case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          etherWithdrawAmount: action.payload
        }
      }

    case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          tokenDepositAmount: action.payload
        }
      }
    case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          tokenWithdrawAmount: action.payload
        }
      }

    case 'BUY_ORDER_AMOUNT_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          buyOrder: {
            ...state.exchange.buyOrder,
            amount: action.payload
          }
        }
      }
    case 'BUY_ORDER_PRICE_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          buyOrder: {
            ...state.exchange.buyOrder,
            price: action.payload
          }
        }
      }
    case 'BUY_ORDER_MAKING':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          buyOrder: {
            ...state.exchange.buyOrder,
            amount: null,
            price: null,
            making: true
          }
        }
      }

    case 'SELL_ORDER_AMOUNT_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          sellOrder: {
            ...state.exchange.sellOrder,
            amount: action.payload
          }
        }
      }
    case 'SELL_ORDER_PRICE_CHANGED':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          sellOrder: {
            ...state.exchange.sellOrder,
            price: action.payload
          }
        }
      }
    case 'SELL_ORDER_MAKING':
      return {
        ...state,
        exchange: {
          ...state.exchange,
          sellOrder: {
            ...state.exchange.sellOrder,
            amount: null,
            price: null,
            making: true
          }
        }
      }

    case 'ORDER_MADE':
      //  prevent duplicate orders
      index = state.exchange.orders.data.findIndex(order => order.id === action.payload.id)

      data = state.exchange.orders.data
      if (index === -1) {
        data = [...state.exchange.orders.data, action.payload]
      }

      return {
        ...state,
        exchange: {
          ...state.exchange,
          orders: {
            ...state.exchange.orders,
            data: data
          },
          buyOrder: {
            ...state.exchange.buyOrder,
            making: false
          },
          sellOrder: {
            ...state.exchange.sellOrder,
            making: false
          }
        }
      }
    default:
      return state
  }
}

export const combineReducers = reducers => {
  return (state, action) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        ...reducers[prop]({ [prop]: acc[prop] }, action)
      }
    }, state)
  }
}
