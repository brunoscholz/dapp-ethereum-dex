export const initialState = {
  web3: null,
  account: null,
  token: null,
  exchange: null
}

export const web3Reducer = (state, action) => {
  switch (action.type) {
    case 'WEB3_LOADED':
      return { ...state, web3: action.payload }
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.payload }
    default:
      return state
  }
}

export const tokenReducer = (state, action) => {
  switch (action.type) {
    case 'TOKEN_LOADED':
      return { ...state, token: action.payload }

    default:
      return state
  }
}

export const exchangeReducer = (state, action) => {
  switch (action.type) {
    case 'EXCHANGE_LOADED':
      return { ...state, exchange: action.payload }

    default:
      return state
  }
}

export const combineReducers = reducers => {
  return (state, action) => {
    return Object.keys(reducers).reduce(
      (acc, prop) => {
        return ({
          ...acc,
          ...reducers[prop]({ [prop]: acc[prop] }, action),
        })
      },
      state
    )
  }
}
