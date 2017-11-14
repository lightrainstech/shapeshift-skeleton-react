import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import {
  GetCoins,
  ValidateAdddress,
  FixedAmountTx,
  CreateFixedTx
} from './helpers'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      coins: {},
      currency: 'ETH',
      returnAddress: '',
      amount: '',
      baseCurrency: 'ETH',
      address: '0xfbfef7a893c63375bd2a24ae4d2ead7f43fd77aa'
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    GetCoins((data) => {
      const coinsLoad = this.getCoinObj(data)
      this.setState({
        coins: {...this.state.coins, ...coinsLoad}
      })
    })
  }

  getCoinObj (data) {
    var coinsLoad = {}
    { Object.keys(data).map((key) => (
      coinsLoad[key] = data[key].name + '( ' + key + ' )'
    )) }
    return coinsLoad
  }

  handleChange (event) {
    var key = event.target.id
    var val = event.target.value
    var obj = {}
    obj[key] = val
    this.setState(obj)
  }

  handleSubmit (event) {
    const {amount, address, currency} = this.state
    const fixedTx = CreateFixedTx(amount, address, currency, 'ETH')
    FixedAmountTx(fixedTx, (data) => {
      const {deposit, depositAmount} = data.success
      const qrdata = "coin" + ':' + deposit + '?amount=' + depositAmount
    })
    event.preventDefault()
  }

  render () {
    const { coins, currency } = this.state

    return (
      <div className='App'>
        <form onSubmit={this.handleSubmit} >
          <div>
            <label>
              Select currency:
              <select value={currency} name={'currency'} id={'currency'} onChange={this.handleChange}>
                { Object.keys(coins).map((k, index) => <option key={index} value={k}>{ `${coins[k]}` }</option>) }
              </select>
            </label>
          </div>
          <div>
            <label>
              Return Address:
              <input type='text' value={this.state.returnAddress} onChange={this.handleChange} id={'returnAddress'} />
            </label>
          </div>
          <div>
            <label>
              Amount:
              <input type='text' value={this.state.amount} onChange={this.handleChange} id={'amount'} />
            </label>
          </div>
          <input type='submit' value='Submit' />
        </form>
      </div>
    )
  }
}

export default App
