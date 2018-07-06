const url = `https://www.alphavantage.co/query?function=`
const apiKey = '&apikey=' + require('../api_key-PRIV.js')
const Symbol = sym => this.sym = sym ? sym : this.sym ? this.sym : '&symbol=MSFT'

const series = {
  curSer: this.curSer ? this.curSer : 'stocks',
  curInt: this.curInt ? this.curInt :  5,
  curTyp: this.curTyp ? this.curTyp : 'bar',
  curVol: this.curVol ? this.curVol : true,
  stocks: {
    intraday: {
      key: 'TIME_SERIES_INTRADAY&interval=',
      int: {
        1: '1min', 5: '5min', 15: '15min', 30: '30min', 60: '60min'
      },
      compose : function(intv){ // defaults to 15
        return this.key + (this['int'][intv] 
                        || this['int'][series.curInt])
      }
    },
    d: 'TIME_SERIES_DAILY',
    w: 'TIME_SERIES_WEEKLY',
    m: 'TIME_SERIES_MONTHLY'
  },
  digCur: {
    i: 'DIGITAL_CURRENCY_INTRADAY',
    d: 'DIGITAL_CURRENCY_DAILY',
    w: 'DIGITAL_CURRENCY_WEEKLY',
    m: 'DIGITAL_CURRENCY_MONTHLY'
  },
  fx:{
    rate: 'CURRENCY_EXCHANGE_RATE'
  }
} 

// rl declared to avoid undeclared error on test
let rl
function parseLine (line){
  line = line.toUpperCase()
  if (/\$\w+\b/.test(line)){
    series.curSer = 'stocks'
    if (/^(i|rate)$/.test(series.curInt)){
      series.curInt = 5
    }
    let stock = line.match(/\$(\w+)\b/)[1]
    Symbol('&symbol=' + stock)
    rl ? rl.setPrompt('_∏_\n^_$; ') : null
  }
  else if (/\¢\w+\b/.test(line)){
    series.curSer = 'digCur'
    if (/^\d|rate$/.test(series.curInt)){
      series.curInt = 'i'
    }
    let coin = line.match(/\¢(\w+)(\b|\/)/)[1]
    let market = /\/\w+/.test(line) ? line.match(/\/(\w+)/)[1] : 'USD'
    Symbol('&symbol=' + coin + '&market=' + market)
    rl ? rl.setPrompt('_∏_\n^_¢; ') : null
  }
  else if (/£\w+\b/.test(line)){
    series.curSer = 'fx'
    series.curInt = 'rate'
    let ex = line.match(/£(\w+)\/(\w+)\b/)
    ex = ex ? `&from_currency=${ex[1]}&to_currency=${ex[2]}` 
      : `&from_currency=USD&to_currency=EUR` 
    Symbol(ex)
    rl ? rl.setPrompt('_∏_\n^_£; ') : null
  }

  if (/:\w+\b/.test(line)){
    let intv = line.match(/:(\w+)\b/)[1].toLowerCase()
    if (series.curSer === 'digCur' && !/[idwm]/.test(intv)){
      intv = 'i'
    }
    else if (series.curSer === 'fx'){
      intv = 'rate'
    }
    else if (series.curSer === 'stocks' && /^(i|rate)$/.test(intv)){
      intv = 5
    }
    timeFunc(null, intv)
  }

  if (/#\w+\b/.test(line)){
    let type = line.match(/#(\w+)\b/)[1]
    if (/^l/i.test(type)){
      series.curTyp = 'line'
    }
    else if (/^b/i.test(type)){
      series.curTyp = 'bar'
    }
    else if (/^o/i.test(type)){
      series.curTyp = 'OHLC'
    }
  }
  
  return urlBuilder()
}

function timeFunc(s, i){
  s = series.curSer = (s || series.curSer) 
  i = series.curInt = (i || series.curInt) 
  return isNaN(+i) ? series[s][i] : series[s]['intraday']['compose'](i)
}

function urlBuilder(){return `${url}${timeFunc()}${Symbol()}${apiKey}`}

module.exports = {
  url: url,
  apiKey, apiKey,
  Symbol: Symbol,
  series: series,
  parseLine: parseLine, 
  timeFunc: timeFunc,
  urlBuilder: urlBuilder
}
