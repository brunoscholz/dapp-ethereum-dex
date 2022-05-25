import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useAppState } from '../contexts/AppState'
import { fillOrder } from '../store'

import {
  orderBookSelector,
  orderBookLoadedSelector,
  exchangeSelector,
  accountSelector,
  orderFillingSelector} from '../store/selectors'
import Spinner from './Spinner'

const OrderBook = () => {
  const [state, dispatch] = useAppState()

  const orderBookLoaded = orderBookLoadedSelector(state)
  const orderBook = orderBookSelector(state)
  const orderFilling = orderFillingSelector(state)

  const exchange = exchangeSelector(state)
  const account = accountSelector(state)

  let showBook = orderBookLoaded && !orderFilling

  const showOrderBook = () => {
    return (
      <tbody>
        {orderBook.sellOrders.map(order => renderOrder(order))}
        <tr>
          <th>DAPP</th>
          <th>Price</th>
          <th>ETH</th>
        </tr>
        {orderBook.buyOrders.map(order => renderOrder(order))}
      </tbody>
    )
  }

  const renderOrder = order => {
    return (
      <OverlayTrigger
        key={order.id}
        placement='auto'
        overlay={<Tooltip id={order.id}>{`Click here to ${order.orderFillAction}`}</Tooltip>}
      >
        <tr key={order.id} className='order-book-order' onClick={e => fillOrder(exchange, order, account, dispatch)}>
          <td>{order.tokenAmount}</td>
          <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          <td>{order.etherAmount}</td>
        </tr>
      </OverlayTrigger>
    )
  }

  return (
    <div className='vertical'>
      <div className='card bg-dark text-white'>
        <div className='card-header'>Order Book</div>
        <div className='card-body'>
          <table className='table table-dark table-sm small'>
            {showBook ? showOrderBook() : <Spinner type={'table'} />}
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
