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
function timeFunc(s, i){
  s = series.curSer = (s || series.curSer) 
  i = series.curInt = (i || series.curInt) 
  return isNaN(+i) ? series[s][i] : series[s]['intraday']['compose'](i)
}

let parseLine = function(line){
  line = line.toUpperCase()
  if (/\$\w+\b/.test(line)){
    rl.setPrompt('_∏_\n^_$; ')
    if (/^(i|rate)$/.test(series.curInt)){
      series.curInt = 5
    }
    series.curSer = 'stocks'
    let stock = line.match(/\$(\w+)\b/)[1]
    //stock = stock ? stock[1] : 'GOOG'
    Symbol('&symbol=' + stock)
  }
  else if (/\¢\w+\b/.test(line)){
    rl.setPrompt('_∏_\n^_¢; ')
    if (/^\d|rate$/.test(series.curInt)){
      series.curInt = 'i'
    }
    series.curSer = 'digCur'
    let coin = line.match(/\¢(\w+)(\b|\/)/)[1]
    let market = /\/\w+/.test(line) ? line.match(/\/(\w+)/)[1] : 'USD'
    Symbol('&symbol=' + coin + '&market=' + market)
  }
  else if (/£\w+\b/.test(line)){
    rl.setPrompt('_∏_\n^_£; ')
    series.curSer = 'fx'
    series.curInt = 'rate'
    let ex = line.match(/£(\w+)\/(\w+)\b/) || ''
    ex = ex.length === 3 ? `&from_currency=${ex[1]}&to_currency=${ex[2]}` 
      : `&from_currency=USD&to_currency=EUR` 
    Symbol(ex)
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
  if (/-\w+/){
    let size = line.match(/-(\w+)\b/)
  }
  
  return urlBuilder()
}
function makePromise(url){
  let data = ''
  let promise = new Promise(function(fill, fail){
    https.get(url, resp => {
      if (resp.statusCode !== 200){
        fail(`err :: status :${resp.statusCode}`)
      }
      else{
        resp.on('data', datum => {
          data += datum
        }).on('end', () => {fill(data)})
      }
    })
  })
  return promise
}

let graphData = require('./graphData.js').objArr
let deftest = require('./tests/defaultTEST.js').obj
let btctest = require('./tests/BTCdTEST.js').obj
let googwtest = require('./tests/GOOGwTEST.js').obj
let eurcadtest = require('./tests/EURCADsTEST.js')
let arrData = graphData(eurcadtest) 

console.log( arrData)

function keepPromiseGraph(data){
  let json = JSON.parse(data)
  let fxStr = 'Realtime Currency Exchange Rate'
  if (json[fxStr]){
    return json
  }
  else{
    return graphData(data)
  }
}

function repl(){
  rl.on('line', function(line){
    let url = parseLine(line)
    //console.log( "parsedLine ", url)
    //let dataPromise = makePromise(url)
    //let graph = dataPromise.then(full => keepPromiseGraph(full))
//    dataPromise.then(() =>{
//      process.stdout.write(`\n${line}\n`)
//      rl.prompt()
//    })
  }).on('end', () =>  repl()) 
}
rl.prompt()
repl()