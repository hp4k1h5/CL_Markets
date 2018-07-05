const assert = require('assert').strict

const { url, apiKey, Symbol, series, parseLine, timeFunc, urlBuilder } = require('../lib/helpers.js')
const { objArr, graphArr } = require('../lib/graphData.js')
const { makeWindow } = require('../lib/gui.js')

let tests = {
  default: {
    url: 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=5min&symbol=MSFT&apikey=FKDNYO8JH1TTETIP',
    data: require('./defaultTEST.js'),
    curSer: 'stocks',
    curInt: 5,
    curTyp: 'bar',
    curVol: true
  },
  GOOGw:{
    url: 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=GOOG&apikey=FKDNYO8JH1TTETIP',
    data: require('./GOOGwTEST.js'),
    curSer: 'stocks',
    curInt: 'w',
    curTyp: 'bar',
    curVol: true
  },
  BTCd: {
    url: 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=FKDNYO8JH1TTETIP',
    data: require('./BTCdTEST.js'),
    curSer: 'digCur',
    curInt: 'd',
    curTyp: 'bar',
    curVol: true
  },
  USDCADs:{
    url: 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=CAD&apikey=FKDNYO8JH1TTETIP',
    data: require('./USDCADsTEST.js'),
    curSer: 'fx',
    curInt: 'rate',
    curTyp: 'bar',
    curVol: true
  }
}

const assertions = {
  defaultURL: function(){
    let a = urlBuilder()
    let e = tests.default.url
    assert(a === e, `${a} ≠ ${e}`)
  },
  $msft: function(){
    let a = parseLine('$msft')
    let e = tests.default.url
    assert(a === e, `${a} ≠ ${e}`)
  },
  '$msft :15': function(){
    let a = parseLine('$msft :15')
    let e = tests.default.url
    assert(a !== e, `${a} ≠ ${e}`)
  },
  '$GOOGw :w': function(){
    let a = parseLine('$GOOG :w')
    let e = tests.GOOGw.url
    assert(a === e, `${a} ≠ ${e}`)
  },
  $GOOGwRefresh: function(){
    let a = urlBuilder() 
    let e = tests.GOOGw.url
    assert(a === e, `${a} ≠ ${e}`)
  },
  '¢BTC :d': function(){
    let a = parseLine('¢BTC :d') 
    let e = tests.BTCd.url
    assert(a === e, `${a} ≠ ${e}`)
  },
  '£usd/cad': function(){
    let a = parseLine('£usd/cad') 
    let e = tests.USDCADs.url
    assert(a === e, `${a} ≠ ${e}`)
  },
  'msft json to array': function(){
    let a = objArr(tests.default.data.obj)
    let e = tests.default.data.arr
    assert.deepEqual(a, e, `a ≠ e`)
  },
  'goog json to array': function(){
    let a = objArr(tests.GOOGw.data.obj)
    let e = tests.GOOGw.data.arr
    assert.deepEqual(a, e, `a ≠ e`)
  },
  'btc json to array': function(){
    let a = objArr(tests.BTCd.data.obj)
    let e = tests.BTCd.data.arr
    assert.deepEqual(a,e, `a ≠ e`)
  }
}

function runTests(){
  Object.keys(assertions).forEach(a => {
    try{
      assertions[a]()
      console.log(`${a} : pass ✅`)
    } catch(e){
      console.error(`${a} : fail ❌\n${e} ERROR`)
    }
  })
}

function runGraphTests(){
  Object.keys(tests).forEach(t => {
    tests[t]['data']['obj'] 
      ? (series.curSer = tests[t]['curSer'],
        series.curInt = tests[t]['curInt'],
        console.log( graphArr(tests[t]['data']['obj'], series))
      )
      : (series.curSer = 'fx',
        console.log(graphArr(tests[t]['data'], series))
        )
  })
}
runTests()
runGraphTests()
