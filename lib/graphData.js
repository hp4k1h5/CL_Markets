const { getDimensions, makeWindow } = require('./gui.js')
let dimensions = getDimensions()
let graphWidth = dimensions[0]-10
let graphHeight = Math.floor(dimensions[1] * .75) - 2
let volHeight = (dimensions[1] - graphHeight) - 4

function objArr(json){
  function findKey(o, k){
    let rgx = new RegExp(k)
    return Object.keys(o).find(key => rgx.test(key))
  }

  let symKey
  let valArr
  if (json['Meta Data']){
    symKey = findKey(json['Meta Data'], '^2.')
    let timeSeries = json[findKey(json, 'Time Series')]
      valArr = Object.keys(timeSeries).map(k => 
        [k].concat(Object.keys(timeSeries[k]).map(v =>
          +timeSeries[k][v]
        ))
      )
    return [json['Meta Data'][symKey], valArr] 
  }
}

function treatData(arr, ser){
  let ticker = arr[0]
  let index = {
    stocks: [0, 1, 2, 3, 4, 5],
    digCur: [0, 1, 3, 5, 7, 9]
  }
  arr = arr[1] 

  let pLow = Math.min(...arr.map(e => e[index[ser.curSer][4]]))
  let pHigh = Math.max(...arr.map(e => e[index[ser.curSer][4]]))
  let vLow = Math.min(...arr.map(e => e[index[ser.curSer][5]]))
  let vHigh = Math.max(...arr.map(e => e[index[ser.curSer][5]]))

  let serLen = arr.length
  let eqWidth = serLen / graphWidth

  let pZeroVals = getAvgs(arr.map(e => e[index[ser.curSer][4]]))
                             .map(e => e - pLow)
  let pZeroHigh = Math.max(...pZeroVals)
  let eqVal = graphHeight / pZeroHigh
  pZeroVals = pZeroVals.map(zV => zV * eqVal)

  let vZeroVals = getAvgs(arr.map(e => e[index[ser.curSer][5]]))
                             .map(e => e - vLow)
  let vZeroHigh = Math.max(...vZeroVals)
  eqVal = volHeight / vZeroHigh
  vZeroVals = vZeroVals.map(zV => zV * eqVal)

  function getAvgs(arr){
    let avgs = []
    for (let p=0; p<serLen; p){
      let range = arr.slice(p, Math.ceil(p + eqWidth))
      let avg = range.reduce((a,v) => a+v) / range.length
      avgs.push(avg)
      p = p + eqWidth
    }
    return avgs
  } 

  let metaData = [
    ticker, 
    ['start:' + arr[arr.length-1][0], 'end:' + arr[0][0]].join(' : '),
    ['low:' + pLow, 'high:' + pHigh].join(' : ')
    ].join('  ::  ') 
    + '\n' 

  return ser.curTyp === 'bar' || ser.curTyp === 'line' 
    ? [pZeroVals, vZeroVals, metaData] : null
}

function makeBarChart(avgs, h){
  let chart = []
  let y = h
  while (y>0){
    let row = []
    for (let x = avgs.length; x>0; x--){
      avgs[x] >= y ? row.push('O') : row.push('.')
    }
    chart.push(row)
    y--
  }
  return chart.map(r => r.join('')).join('\n') + '\n'
}

function makeLineChart(avgs, h){
  let chart = []
  let y = h
  while (y>0){
    let row = []
    for (let x = avgs.length; x>0; x--){
      Math.ceil(avgs[x]) === y 
        ? x<avgs.length-1 && Math.ceil(avgs[x])>Math.ceil(avgs[x+1]) 
          ? row.push('/')
          : x<avgs.length-1 && Math.ceil(avgs[x])<Math.ceil(avgs[x+1])
            ? row.push('\\') 
          : row.push('-')
        : row.push(' ')
    }
    chart.push(row)
    y--
  }
  return chart.map(r => r.join('')).join('\n') + '\n'
}

function graphArr(json, ser){
  if (ser.curSer === 'fx') return json
  let arr = treatData(objArr(json), ser)
  let metaData = arr[2]

  const types = {
    bar: makeBarChart(arr[0], graphHeight) 
      + '\n' + makeBarChart(arr[1], volHeight),
    line: makeLineChart(arr[0], graphHeight) 
      + '\n'+ makeLineChart(arr[1], volHeight),
    OHLC: {},
    none: () => json
  }

  return metaData + types[ser.curTyp]
}

module.exports = {
  objArr: objArr,
  graphArr: graphArr
}
