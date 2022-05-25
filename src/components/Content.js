import { useAppState } from '../contexts/AppState'
import { useEffect } from 'react'
import { loadAllOrders, subscribeToEvents } from '../store'
import { exchangeSelector } from '../store/selectors'

import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Balance'
import NewOrder from './NewOrder'

const Content = () => {
  const [ state, dispatch ] = useAppState()

  const exchange = exchangeSelector(state)

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    await loadAllOrders(exchangeSelector(state), dispatch)
    await subscribeToEvents(exchange, dispatch)
  }

  return (
    <div className='content'>
      <div className='vertical-split'>
        <Balance />
        <NewOrder />
      </div>
      <OrderBook />
      <div className='vertical-split'>
        <PriceChart />
        <MyTransactions />
      </div>
      <Trades />
    </div>
  )

}

export default Content