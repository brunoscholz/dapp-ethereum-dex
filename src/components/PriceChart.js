import { useAppState } from '../contexts/AppState'
import Chart from 'react-apexcharts'

import { chartOptions, dummyData } from './PriceChart.config'
import { priceChartSelector, priceChartLoadedSelector } from '../store/selectors'
import Spinner from './Spinner'

const PriceChart = () => {
  const [state] = useAppState()

  const priceChartLoaded = priceChartLoadedSelector(state)
  const priceChart = priceChartSelector(state)

  const priceSymbol = (lastPriceChange) => {
    let output
    if (lastPriceChange === '+') {
      output = <span className='text-success'>&#9650;</span>
    } else {
      output = <span className='text-danger'>&#9660;</span>
    }
    return output
  }

  const showPriceChart = () => {
    return (
      <div className='price-chart'>
        <div className='price'>
          <h4>DAPP/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
        </div>
        <Chart options={chartOptions} series={dummyData} type='candlestick' width='100%' height='100%' />
      </div>
    )
  }

  return (
    <div className='card bg-dark text-white'>
      <div className='card-header'>PriceChart</div>
      <div className='card-body'>
        {priceChartLoaded ?  showPriceChart() : <Spinner />}
      </div>
    </div>
  )
}

export default PriceChart
