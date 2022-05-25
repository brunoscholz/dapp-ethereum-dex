import { Tabs, Tab } from 'react-bootstrap'
import { useAppState } from '../contexts/AppState'
import { makeBuyOrder, makeSellOrder } from '../store'
// import {

// } from '../store'

import {
  accountSelector,
  exchangeSelector,
  tokenSelector,
  web3Selector,
  buyOrderSelector,
  sellOrderSelector
} from '../store/selectors'
import Spinner from './Spinner'

const NewOrder = () => {
  const [state, dispatch] = useAppState()

  const conn = web3Selector(state)
  const exchange = exchangeSelector(state)
  const account = accountSelector(state)
  const token = tokenSelector(state)

  const buyOrder = buyOrderSelector(state)
  const sellOrder = sellOrderSelector(state)
  const loading = buyOrder.making || sellOrder.making

  const showBuyTotal = buyOrder.amount && buyOrder.price
  const showSellTotal = sellOrder.amount && sellOrder.price

  const showForm = () => {
    return (
      <Tabs defaultActiveKey='buy' className='bg-dark text-white'>
        <Tab eventKey='buy' title='Buy' className='bg-dark'>
          <form onSubmit={(event) => {
            event.preventDefault()
            makeBuyOrder(conn, exchange, token, account, buyOrder, dispatch)
          }}>
            <div className='form-group small'>
              <label>Buy Amount (DAPP)</label>
              <div className='input-group'>
                <input
                  type='text'
                  placeholder='Buy Amount'
                  className='form-control form-control-sm bg-dark text-white'
                  onChange={(e) => dispatch({ type: 'BUY_ORDER_AMOUNT_CHANGED', payload: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className='form-group small'>
              <label>Buy Price</label>
              <div className='input-group'>
                <input
                  type='text'
                  placeholder='Buy Price'
                  className='form-control form-control-sm bg-dark text-white'
                  onChange={(e) => dispatch({ type: 'BUY_ORDER_PRICE_CHANGED', payload: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type='submit' className='btn btn-primary btn-block btn-sm'>Buy Order</button>
            { showBuyTotal ? <small className='text-muted'>{buyOrder.amount * buyOrder.price} ETH</small> : null }
          </form>
        </Tab>
        <Tab eventKey='sell' title='Sell' className='bg-dark'>
          <form onSubmit={(event) => {
            event.preventDefault()
            makeSellOrder(conn, exchange, token, account, sellOrder, dispatch)
          }}>
            <div className='form-group small'>
              <label>Sell Amount (DAPP)</label>
              <div className='input-group'>
                <input
                  type='text'
                  placeholder='Sell Amount'
                  className='form-control form-control-sm bg-dark text-white'
                  onChange={(e) => dispatch({ type: 'SELL_ORDER_AMOUNT_CHANGED', payload: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className='form-group small'>
              <label>Sell Price</label>
              <div className='input-group'>
                <input
                  type='text'
                  placeholder='Sell Price'
                  className='form-control form-control-sm bg-dark text-white'
                  onChange={(e) => dispatch({ type: 'SELL_ORDER_PRICE_CHANGED', payload: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type='submit' className='btn btn-primary btn-block btn-sm'>Sell Order</button>
            { showSellTotal ? <small className='text-muted'>{sellOrder.amount * sellOrder.price} ETH</small> : null }
          </form>
        </Tab>
      </Tabs>
    )
  }

  return (
    <div className='card bg-dark text-white'>
      <div className='card-header'>New Order</div>
      <div className='card-body'>
        { !loading ? showForm() : <Spinner />}
      </div>
    </div>
  )
}

export default NewOrder
