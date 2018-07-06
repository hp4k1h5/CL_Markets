const https = require('https')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '_∏_\n^_$; '
})

const { url, apiKey, Symbol, series, parseLine, timeFunc, urlBuilder } = require('./lib/helpers.js')
const { objArr, graphArr } = require('./lib/graphData.js')
const { makeWindow } = require('./lib/gui.js')

// tests
let deftest = require('./tests/defaultTEST.js').obj
//let btctest = require('./tests/BTCdTEST.js').obj
//let googwtest = require('./tests/GOOGwTEST.js').obj
//let eurcadtest = require('./tests/USDCADsTEST.js')
//let notjson = 'this is not json'

function makePromise(url){
  let data = ''
  let promise = new Promise(function(fill, fail){
    https.get(url, resp => {
      resp.on('data', datum => {
        let headers = resp.headers
        data += datum
      }).on('end', () => {fill(data)})
    }).on('error', e => fail(e.message))
  })
  return promise
}

function testPromise (src){
    return new Promise((fill, fail) => {fill(src)})
}

function keepPromiseTest(data){
  let termWidth = process.stdout.columns
  let termHeight = process.stdout.rows
  let termWindow = makeWindow(termWidth, termHeight)
  let graph = keep
  return null
}

function keepPromiseJSON(data){
  let json
  try{
    json = JSON.parse(data)
  } catch (e){
    console.error( e.message)
  }
  return json || data
}

function keepPromiseGraph(json){
  if (json['Realtime Currency Exchange Rate']){
    console.log( 'rcer')
    return JSON.stringify(json['Realtime Currency Exchange Rate']).split(',').join('\n')
  } 
  return  graphArr(json, series)
}

function repl(){
  rl.on('line', function(line){
    let url = parseLine(line)
    let dataPromise = makePromise(url)
      .then(data => keepPromiseJSON(data), console.error)
      .then(json => keepPromiseGraph(json), console.error)
      .then(chart => process.stdout.write(`${chart}`), console.error)
    .then(() => {
      rl.setPrompt(series.curSer === 'stocks' 
        ? ('_∏_\n^_$; ')
        : series.curSer === 'digCur'
        ? ('_∏_\n^_¢; ')
        : ('_∏_\n^_£; ')
      )
      rl.prompt()
    })

  }).on('end', () =>  repl()) 
}

rl.prompt()
repl()
