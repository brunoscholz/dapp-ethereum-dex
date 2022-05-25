import './App.css'
import React, { useEffect } from 'react'
import { loadWeb3, loadAccount, loadToken, loadExchange } from '../store'

import { contractLoadedSelector } from '../store/selectors'

import { useAppState } from '../contexts/AppState'
import Navbar from './Navbar'
import Content from './Content'

const App = () => {
  const [ state, dispatch ] = useAppState()
  // const { web3, token, exchange } = state

  useEffect(() => {
    // Anything in here is fired on component mount.
    loadBlockchainData()

    return () => {
      // Anything in here is fired on component unmount.
    }
  }, [])

  const loadBlockchainData = async () => {
    const web3 = loadWeb3(dispatch)
    // const network = await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)

    const token = await loadToken(web3, networkId, dispatch)
    if (!token) {
      window.alert('Token smart contract not detected in the current network.')
      return
    }

    const exchange = await loadExchange(web3, networkId, dispatch)
    if (!exchange) {
      window.alert('Exchange smart contract not detected in the current network.')
      return
    }

    const totalSupply = await token.methods.totalSupply().call()
  }

  return (
    <div>
      <Navbar />
      { contractLoadedSelector(state) ? <Content /> : <div className='content'></div> }
    </div>
  )
}

export default App
