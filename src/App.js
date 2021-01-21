import logo from './logo.svg'
import './App.css'

import {
  totpSecret,
  userName,
  password
} from './secret'
import Avanza from 'avanza'
const avanza = new Avanza()

function App () {
  const connect = () => {
    avanza.authenticate({
      username: userName,
      password: password,
      totpSecret: totpSecret
    }).then(async () => {
      const positions = await avanza.getPositions()
      console.log(positions)
    })
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>

        <button onClick={connect}>Connect to avanza</button>

      </header>
    </div>
  )
}

export default App
