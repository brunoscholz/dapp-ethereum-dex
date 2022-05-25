import { useEffect } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useAppState } from '../contexts/AppState'
import {
  loadBalances,
  depositEther,
  withdrawEther,
  depositToken,
  withdrawToken
} from '../store'

import {
  accountSelector,
  exchangeSelector,
  tokenSelector,
  web3Selector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  etherBalanceSelector,
  tokenBalanceSelector,
  balancesLoadingSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector
} from '../store/selectors'
import Spinner from './Spinner'

const Balance = () => {
  const [state, dispatch] = useAppState()

  const conn = web3Selector(state)
  const exchange = exchangeSelector(state)
  const account = accountSelector(state)
  const token = tokenSelector(state)

  const loading = balancesLoadingSelector(state)
  const etherBalance = etherBalanceSelector(state)
  const tokenBalance = tokenBalanceSelector(state)
  const exchangeEtherBalance = exchangeEtherBalanceSelector(state)
  const exchangeTokenBalance = exchangeTokenBalanceSelector(state)

  const etherDepositAmount = etherDepositAmountSelector(state)
  const etherWithdrawAmount = etherWithdrawAmountSelector(state)
  const tokenDepositAmount = tokenDepositAmountSelector(state)
  const tokenWithdrawAmount = tokenWithdrawAmountSelector(state)

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    await loadBalances(conn, exchange, token, account, dispatch)
    // await subscribeToEvents(exchange, dispatch)
  }

  const showForm = () => {
    return (
      <Tabs defaultActiveKey='deposit' className='bg-dark text-white'>
        <Tab eventKey='deposit' title='Deposit' className='bg-dark'>
          <table className='table table-dark table-sm small'>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wallet</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH</td>
                <td>{etherBalance}</td>
                <td>{exchangeEtherBalance}</td>
              </tr>
            </tbody>
          </table>
          <form className='row' onSubmit={(event) => {
            event.preventDefault()
            depositEther(conn, exchange, token, account, etherDepositAmount, dispatch)
          }}>
            <div className='col-12 col-sm pr-sm-2'>
              <input
                type='text'
                placeholder='ETH Amount'
                className='form-control form-control-sm bg-dark text-white'
                onChange={(e) => dispatch({ type: 'ETHER_DEPOSIT_AMOUNT_CHANGED', payload: e.target.value })}
                required
              />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
              <button type='submit' className='btn btn-primary btn-block btn-sm'>Deposit</button>
            </div>
          </form>
          <table className='table table-dark table-sm small'>
            <tbody>
              <tr>
                <td>DAPP</td>
                <td>{tokenBalance}</td>
                <td>{exchangeTokenBalance}</td>
              </tr>
            </tbody>
          </table>
          <form className='row' onSubmit={(event) => {
            event.preventDefault()
            depositToken(conn, exchange, token, account, tokenDepositAmount, dispatch)
          }}>
            <div className='col-12 col-sm pr-sm-2'>
              <input
                type='text'
                placeholder='DAPP Amount'
                className='form-control form-control-sm bg-dark text-white'
                onChange={(e) => dispatch({ type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED', payload: e.target.value })}
                required
              />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
              <button type='submit' className='btn btn-primary btn-block btn-sm'>Deposit</button>
            </div>
          </form>
        </Tab>
        <Tab eventKey='withdraw' title='Withdraw' className='bg-dark'>
          <table className='table table-dark table-sm small'>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wallet</th>
                <th>Exchange</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ETH</td>
                <td>{etherBalance}</td>
                <td>{exchangeEtherBalance}</td>
              </tr>
            </tbody>
          </table>
          <form className='row' onSubmit={(event) => {
            event.preventDefault()
            withdrawEther(conn, exchange, token, account, etherWithdrawAmount, dispatch)
          }}>
            <div className='col-12 col-sm pr-sm-2'>
              <input
                type='text'
                placeholder='ETH Amount'
                className='form-control form-control-sm bg-dark text-white'
                onChange={(e) => dispatch({ type: 'ETHER_WITHDRAW_AMOUNT_CHANGED', payload: e.target.value })}
                required
              />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
              <button type='submit' className='btn btn-primary btn-block btn-sm'>Withdraw</button>
            </div>
          </form>
          <table className='table table-dark table-sm small'>
            <tbody>
              <tr>
                <td>DAPP</td>
                <td>{tokenBalance}</td>
                <td>{exchangeTokenBalance}</td>
              </tr>
            </tbody>
          </table>
          <form className='row' onSubmit={(event) => {
            event.preventDefault()
            withdrawToken(conn, exchange, token, account, tokenWithdrawAmount, dispatch)
          }}>
            <div className='col-12 col-sm pr-sm-2'>
              <input
                type='text'
                placeholder='DAPP Amount'
                className='form-control form-control-sm bg-dark text-white'
                onChange={(e) => dispatch({ type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED', payload: e.target.value })}
                required
              />
            </div>
            <div className='col-12 col-sm-auto pl-sm-0'>
              <button type='submit' className='btn btn-primary btn-block btn-sm'>Withdraw</button>
            </div>
          </form>
        </Tab>
      </Tabs>
    )
  }

  return (
    <div className='card bg-dark text-white'>
      <div className='card-header'>Balance</div>
      <div className='card-body'>
        {!loading ? showForm() : <Spinner />}
      </div>
    </div>
  )
}

export default Balance
