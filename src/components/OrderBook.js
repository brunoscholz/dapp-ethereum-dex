import { useAppState } from '../contexts/AppState'

import { orderBookSelector, orderBookLoadedSelector } from '../store/selectors'
import Spinner from './Spinner'

const OrderBook = () => {
  const [state] = useAppState()

  const orderBook = orderBookSelector(state)
  const orderBookLoaded = orderBookLoadedSelector(state)

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
      <tr key={order.id}>
        <td>{order.tokenAmount}</td>
        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
        <td>{order.etherAmount}</td>
      </tr>
    )
  }

  return (
    <div className='vertical'>
      <div className='card bg-dark text-white'>
        <div className='card-header'>Order Book</div>
        <div className='card-body'>
          <table className='table table-dark table-sm small'>
            {orderBookLoaded ? showOrderBook() : <Spinner type={'table'} />}
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
