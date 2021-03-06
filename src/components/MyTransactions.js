import { useAppState } from '../contexts/AppState'
import { Tabs, Tab } from 'react-bootstrap'

import {
  myFilledOrdersLoadedSelector,
  myFilledOrdersSelector,
  myOpenOrdersLoadedSelector,
  myOpenOrdersSelector,
  accountSelector,
  exchangeSelector,
  orderCancellingSelector
} from '../store/selectors'
import Spinner from './Spinner'
import { cancelOrder } from '../store/actions'

const MyTransactions = () => {
  const [state, dispatch] = useAppState()

  const myFilledOrders = myFilledOrdersSelector(state)
  const myFilledOrdersLoaded = myFilledOrdersLoadedSelector(state)
  const myOpenOrders = myOpenOrdersSelector(state)
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)
  const orderCancelling = orderCancellingSelector(state)

  let showOpenOrders = myOpenOrdersLoaded && !orderCancelling

  const account = accountSelector(state)
  const exchange = exchangeSelector(state)

  const showMyFilledOrders = () => {
    return (
      <tbody>
        {myFilledOrders.map(order => {
          return (
            <tr key={order.id}>
              <th className='text-muted'>{order.formatedTimestamp}</th>
              <td className={`text-${order.orderTypeClass}`}>
                {order.orderSign}
                {order.tokenAmount}
              </td>
              <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  const showMyOpenOrders = () => {
    return (
      <tbody>
        {myOpenOrders.map(order => {
          return (
            <tr key={order.id}>
              <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
              <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
              <th
                className='text-muted cancel-order'
                onClick={(e) => cancelOrder(exchange, order, account, dispatch)}
              >
                X
              </th>
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <div className='card bg-dark text-white'>
      <div className='card-header'>My Transactions</div>
      <div className='card-body'>
        <Tabs defaultActiveKey='trades' className='bg-dark text-white'>
          <Tab eventKey='trades' title='Trades' className='bg-dark'>
            <table className='table table-dark table-sm small'>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>DAPP</th>
                  <th>DAPP/ETH</th>
                </tr>
              </thead>
              {myFilledOrdersLoaded ? showMyFilledOrders() : <Spinner type="table" />}
            </table>
          </Tab>
          <Tab eventKey='orders' title='Orders'>
            <table className='table table-dark table-sm small'>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>DAPP/ETH</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              {showOpenOrders ? showMyOpenOrders() : <Spinner type="table" />}
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default MyTransactions
