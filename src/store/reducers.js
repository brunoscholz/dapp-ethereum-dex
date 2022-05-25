export const initialState = {
  web3: null,
  account: null,
  token: null,
  exchange: null
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
          loaded: true,
          contract: action.payload
        }
      }

    default:
      return state
  }
}

export const exchangeReducer = (state, action) => {
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
