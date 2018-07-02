let tests = {
  default: {
    url: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=MSFT&apikey=FKDNYO8JH1TTETIP',
    data: require('./defaultTEST.js')
  },
  GOOGw:{
    url: 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=GOOG&apikey=FKDNYO8JH1TTETIP',
    data: require('./BTCdTEST.js')
  },
  BTCd: {
    url: 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=FKDNYO7JH1TTETIP',
    data: require('./BTCdTEST.js') 
  },
  USDCADs:{
    url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CAD&apikey=FKDNYO8JH1TTETIP',
    data: require('./EURCADsTEST.js')
  }
}
console.log( tests.default.data)
console.log( tests.GOOGw.data)
console.log( tests.BTCd.data)
console.log( tests.USDCADs.data)

