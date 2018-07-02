const apiKey = '&apikey=' + require('./api_key-PRIV.js')
const https = require('https')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '_∏_\n^_$; '
})

let demo = () => {url+= 'TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo'} 
let url = `https://www.alphavantage.co/query?function=`
let Symbol = function(sym){
  return this.sym = sym ? sym : this.sym ? this.sym : '&symbol=MSFT'
}

let urlBuilder = () => `${url}${timeFunc()}${Symbol()}${apiKey}`

let series = {
  curSer: this.curSer ? this.curSer : 'stocks',
  curInt: this.curInt ? this.curInt :  5,
  stocks: {
    intraday: {
      key: 'TIME_SERIES_INTRADAY',
      int: {
        1: '1min', 5: '5min', 15: '15min', 30: '30min', 60: '60min'
      },
      compose : function(intv){ // defaults to 15
        return this.key + '&interval=' + (this['int'][intv] || series.curInt)
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
function timeFunc(s, i){
  s = series.curSer = (s || series.curSer) 
  i = series.curInt = (i || series.curInt) 
  return isNaN(+i) ? series[s][i] : series[s]['intraday']['compose'](i)
}

let parseLine = function(line){
  if (/\$/.test(line)){
    rl.setPrompt('_∏_\n^_$; ')
    if (/^(i|rate)$/.test(series.curInt)){
      series.curInt = 5
    }
    series.curSer = 'stocks'
    let stock = line.match(/\$(\w+)\b/)
    stock = stock ? stock[1] : 'GOOG'
    Symbol('&symbol=' + stock)
  }
  else if (/\¢/.test(line)){
    rl.setPrompt('_∏_\n^_¢; ')
    if (/^\d|rate$/.test(series.curInt)){
      series.curInt = 'i'
    }
    series.curSer = 'digCur'
    let coin = line.match(/\¢(\w+)\b/)
    coin = coin ? coin[1] : null
    Symbol('&symbol=' + coin)
  }
  else if (/£/.test(line)){
    rl.setPrompt('_∏_\n^_£; ')
    series.curSer = 'fx'
    series.curInt = 'rate'
    let ex = line.match(/£(\w+)\/(\w+)\b/)
    ex = ex ? `&from_currency=${ex[1]}&to_currency=${ex[2]}` 
      : `&from_currency=USD&to_currency=EUR` 
    Symbol(ex)
  }

  if (/:\w+/.test(line)){
    let intv = line.match(/:(\w+)\b/)
    if (series.curSer === 'digCur' && !/[idwm]/.test(intv[1])){
      intv[1] = 'i'
    }
    else if (series.curSer === 'fx'){
      intv[1] = 'rate'
    }
    else if (series.curSer === 'stocks' && /^(i|rate)$/.test(intv[1])){
      intv[1] = 5
    }
    timeFunc(null, intv[1])
  }
  return urlBuilder()
}

rl.prompt()
repl()
function repl(){
  rl.on('line', function(line){
    let parsedLine = parseLine(line)
    console.log( "parsedLine ",parsedLine )
    
    process.stdout.write(`\n${line}\n`)
    rl.prompt()
  }).on('end', () =>  repl()) 
}
