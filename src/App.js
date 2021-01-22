import './App.css'
import styled from 'styled-components'
import {
  totpSecret,
  userName,
  password
} from './secret'
import { useEffect, useState } from 'react'
const { ipcRenderer } = window.require('electron')

const Green = styled.div`
  background-color: #00c281;
  widht: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BigNumber = styled.h1`
  color: #fff;
`

function App () {
  const [totalOwnCapital, setTotalOwnCapital] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [totalProfitPercent, setTotalProfitPercent] = useState(0)

  const connect = () => {
    ipcRenderer.send('connect', JSON.stringify({ totpSecret, userName, password }))
  }

  useEffect(() => {
    connect()
    // getChart()

    ipcRenderer.on('positions', (event, arg) => {
      console.log(JSON.parse(arg))
      const positions = JSON.parse(arg)
      setTotalOwnCapital(positions.totalOwnCapital)
      setTotalProfit(positions.totalProfit)
      setTotalProfitPercent(positions.totalProfitPercent)

      // const orderBookIds = positions.instrumentPositions.map(instrument => {
      //   return instrument.positions.map(position => positions.orderbookId)
      // })
      // console.log(orderBookIds)
    })

    ipcRenderer.on('chart', (event, arg) => {
      console.log('CHARTDATA!')
      console.log(JSON.parse(arg))
    })
  }, [])

  return (
    <div className='App'>
      <Green>
        <BigNumber>
          {totalOwnCapital}kr
          (+{totalProfit})
        </BigNumber>
      </Green>
    </div>
  )
}

export default App
