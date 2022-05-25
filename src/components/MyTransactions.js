import { useAppState } from '../contexts/AppState'
import { Tabs, Tab } from 'react-bootstrap'

import {
  myFilledOrdersLoadedSelector,
  myFilledOrdersSelector,
  myOpenOrdersLoadedSelector,
  myOpenOrdersSelector
} from '../store/selectors'
import Spinner from './Spinner'

const MyTransactions = () => {
  const [state] = useAppState()

  const myFilledOrders = myFilledOrdersSelector(state)
  const myFilledOrdersLoaded = myFilledOrdersLoadedSelector(state)
  const myOpenOrders = myOpenOrdersSelector(state)
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)

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
              <th className='text-muted'>x</th>
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
              {myOpenOrdersLoaded ? showMyOpenOrders() : <Spinner type="table" />}
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default MyTransactions
