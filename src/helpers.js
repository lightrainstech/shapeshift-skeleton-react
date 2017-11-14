const JP = JSON.parse
const JS = JSON.stringify

const GetCoins = (cb) => {
  var apiEp = getArgsAdder(endPoints.GetCoins)
  var xmlhttp = CreateXmlHttp()
  AjaxRequest(xmlhttp, apiEp, function (response) {
    cbProtector(cb, response)
  })
}

const ValidateAdddress = (address, coinSymbol, cb) => {
  if (address === undefined) throw new Error('no address provided')
  if (coinSymbol === undefined) throw new Error('no coin symbol provided')
  var apiEp = getArgsAdder(endPoints.ValidateAddress, [address, coinSymbol])
  var xmlhttp = CreateXmlHttp()
  AjaxRequest(xmlhttp, apiEp, function (response) {
    console.log(response)
    cbProtector(cb, response)
  })
}

const FixedAmountTx = (data, cb) => {
      // TODO validateData(data);
  data = FixedAmountValidate(data, this)
  var apiEp = getArgsAdder(endPoints.FixedAmountTx)
  var xmlhttp = CreateXmlHttp()
  console.log('FixedAmountTx', data)
  AjaxRequest(xmlhttp, apiEp, data, function (response) {
    console.log('FixedAmountTx --res', response)

    cbProtector(cb, response)
  })
}

const FixedAmountValidate = (data, ss) => {
  if (data.withdrawal === undefined) throw new Error('no withdrawal address')
  if (data.pair === undefined) throw new Error('no pair given')
  if (data.amount === undefined) throw new Error('no amount given')
      // TODO check if valid pair
      // TODO check if any other data in there is valid

  data.apiPubKey = ss.apiPubKey
  return data
}

const CreateFixedTx = (amount, withdrawalAddress, coin1, coin2) => {
  var NormalTx = {
    amount: amount,
    withdrawal: withdrawalAddress,
    pair: coinPairer(coin1, coin2)
  }
  return NormalTx
}

const coinPairer = (coin1, coin2) => {
  var pair = null

  if (coin1 === undefined && coin2 === undefined) return ''
  if (typeof (coin1) === 'function') return ''
  if (typeof (coin2) === 'function') return coin1.toLowerCase()
  if (coin1 === undefined) return pair
  if (coin2 === undefined) return coin1.toLowerCase()
  return coin1.toLowerCase() + '_' + coin2.toLowerCase()
}

module.exports = {
  GetCoins,
  ValidateAdddress,
  FixedAmountTx,
  CreateFixedTx
}

var endPoints = {
  Rate: { path: 'rate', method: 'GET' },
  DepositLimit: { path: 'limit', method: 'GET' },
  MarketInfo: { path: 'marketinfo', method: 'GET' },
  RecentTxList: { path: 'recenttx', method: 'GET' },
  StatusOfDepositToAddress: { path: 'txStat', method: 'GET' },
  TimeRemainingFixedAmountTx: { path: 'timeremaining', method: 'GET' },
  GetCoins: { path: 'getcoins', method: 'GET' },
  GetTxListWithKey: { path: 'txbyapikey', method: 'GET' },
  GetTxToAddressWithKey: { path: 'txbyaddress', method: 'GET' },
  ValidateAddress: { path: 'validateAddress', method: 'GET' },
  NormalTx: { path: 'shift', method: 'POST'},
  RequestEmailReceipt: { path: 'mail', method: 'POST'},
  FixedAmountTx: { path: 'sendamount', method: 'POST'},
  QuoteSendExactPrice: { path: 'sendamount', method: 'POST'},
  CancelPendingTx: { path: 'cancelpending', method: 'POST'}
}

function getArgsAdder (endPoint, args) {
  var clone = {
    path: endPoint.path,
    method: endPoint.method
  }
  if (args !== undefined && args[0] !== null) {
    for (var i = 0; i < args.length; i++) {
      clone.path = clone.path + '/' + args[i]
    }
  }

  return clone
}

function CreateXmlHttp () {
  var xmlhttp
  xmlhttp = new XMLHttpRequest()
  return xmlhttp
}

function AjaxRequest (xmlhttp, apiEp, data, cb) {
  if (cb === undefined) {
    cb = data
  }

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        var parsedResponse = JP(xmlhttp.responseText)
        cb.apply(null, [parsedResponse])
      } else {
        cb.apply(null, [new Error('Request Failed')])
      }
    }
  }

  var url = 'https://shapeshift.io/' + apiEp.path
  var type = apiEp.method

  xmlhttp.open(apiEp.method, url, true)
  if (type.toUpperCase() === 'POST') {
    xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xmlhttp.send(JS(data))
  } else if (type.toUpperCase() === 'GET') {
    xmlhttp.send()
  }
}

function cbProtector (cb, data) {
  if (cb === undefined) return
  if (typeof (cb) === 'function') cb(data)
}
