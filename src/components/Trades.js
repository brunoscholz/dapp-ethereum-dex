import { useAppState } from '../contexts/AppState'

import { filledOrdersSelector, filledOrdersLoadedSelector } from '../store/selectors'
import Spinner from './Spinner'

const Trades = () => {
  const [ state ] = useAppState()

  const filledOrders = filledOrdersSelector(state)
  const filledOrdersLoaded = filledOrdersLoadedSelector(state)

  const showFilledOrders = () => {
    return (
      <tbody>
        {filledOrders.map((order) => {
          return (
            <tr key={order.id} className={`order-${order.id}`}>
              <th className='text-muted'>{order.formatedTimestamp}</th>
              <td>{order.tokenAmount}</td>
              <td className={`text-${order.tokenClassPrice}`}>{order.tokenPrice}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <div className='vertical'>
      <div className='card bg-dark text-white'>
        <div className='card-header'>Trades</div>
        <div className='card-body'>
          <table className='table table-dark table-sm small'>
            <thead>
              <tr>
                <th scope='col'>Time</th>
                <th scope='col'>DAPP</th>
                <th scope='col'>DAPP/ETH</th>
              </tr>
            </thead>
            {filledOrdersLoaded ? showFilledOrders() : <Spinner type={'table'} />}
          </table>
        </div>
      </div>
    </div>
  )
}

export default Trades
