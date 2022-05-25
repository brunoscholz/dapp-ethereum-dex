import { useAppState } from '../contexts/AppState'
import { useEffect } from 'react'
import { loadAllOrders } from '../store'
import { exchangeSelector } from '../store/selectors'

import Trades from './Trades'
import OrderBook from './OrderBook'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'

const Content = () => {
  const [ state, dispatch ] = useAppState()

  useEffect(() => {
    loadAllOrders(exchangeSelector(state), dispatch)
  }, [])

  return (
    <div className='content'>
      <div className='vertical-split'>
        <div className='card bg-dark text-white'>
          <div className='card-header'>Card Title</div>
          <div className='card-body'>
            <p className='card-text'>
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>
            <a href='/#' className='card-link'>
              Card link
            </a>
          </div>
        </div>
        <div className='card bg-dark text-white'>
          <div className='card-header'>Card Title</div>
          <div className='card-body'>
            <p className='card-text'>
              Some quick example text to build on the card title and make up the bulk of the card's content.
            </p>
            <a href='/#' className='card-link'>
              Card link
            </a>
          </div>
        </div>
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