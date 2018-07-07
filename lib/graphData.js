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
  let oPLow, oPHigh, hPLow, hPHigh, cPLow, cPHigh
  if (ser.curTyp === 'OHLC'){
    oPLow = Math.min(...arr.map(e => e[index[ser.curSer][1]]))
    oPHigh = Math.max(...arr.map(e => e[index[ser.curSer][1]]))
    hPLow = Math.min(...arr.map(e => e[index[ser.curSer][2]]))
    hPHigh = Math.max(...arr.map(e => e[index[ser.curSer][2]]))
    lPLow = Math.min(...arr.map(e => e[index[ser.curSer][3]]))
    lPHigh = Math.max(...arr.map(e => e[index[ser.curSer][3]]))
  }

  function zeroVal(arr, col, low, h){
    let avgs
    if (/line|bar/.test(ser.curTyp)){
      avgs = getAvgs(arr.map(e => e[index[ser.curSer][col]])).map(e => e - low)
    }
    else if (ser.curTyp === 'OHLC'){
      avgs = getOHLCs(arr.map(e => e[index[ser.curSer][col]]), col).map(e => e - low)
    }
    let zHigh = Math.max(...avgs)
    let eqVal = h / zHigh
    avgs = avgs.map(zV => zV * eqVal)
    return avgs
  }

  let pZeroVals = zeroVal(arr, 4, pLow, graphHeight)
  let vZeroVals = zeroVal(arr, 5, vLow, volHeight)
  let oZeroVals, hZeroVals, lZeroVals
  if(ser.curTyp === 'OHLC'){
    oZeroVals = zeroVal(arr, 1, oPLow, graphHeight)
    hZeroVals = zeroVal(arr, 2, hPLow, graphHeight)
    lZeroVals = zeroVal(arr, 3, lPLow, graphHeight)
  }

  function getAvgs(arr){
    let serLen = arr.length
    let eqWidth = serLen / graphWidth
    let avgs = []
    for (let p=0; p<serLen; p){
      let range = arr.slice(p, Math.ceil(p + eqWidth))
      let avg = range.reduce((a,v) => a + v) / range.length
      avgs.push(avg)
      p = p + eqWidth
    }
    return avgs
  } 

  function getOHLCs(arr, col){
    let serLen = arr.length
    let eqWidth = serLen / graphWidth
    let ohlcs = []
    let val
    for (let p=0; p<=serLen; p){
      let range = arr.slice(p, Math.ceil(p + eqWidth))
      val = col === 1 || col === 4 || col === 5
        ? range.reduce((a,v) => a + v) / range.length
        : col === 2
          ? Math.max(...range)
          : Math.min(...range)
      ohlcs.push(val)
      p = p + eqWidth
    }
    return ohlcs
  }

  let metaData = [
    [ticker, 'start:' + arr[arr.length-1][0], 'end:' + arr[0][0]].join(' : '),
    ['low:' + pLow.toFixed(2), 'high:' + pHigh.toFixed(2)].join(' : ')
    ].join('\n::') 
    + '\n' 

  return ser.curTyp === 'bar' || ser.curTyp === 'line' 
    ? [pZeroVals, vZeroVals, metaData]
    : [oZeroVals, hZeroVals, lZeroVals, pZeroVals, vZeroVals, metaData]
}

function makeBarChart(avgs, h){
  let chart = []
  let y = h
  while (y-->0){
    let row = []
    for (let x = avgs.length-1; x>=0; x--){
      avgs[x] >= y ? row.push('O') : row.push('.')
    }
    chart.push(row)
  }
  return chart.map(r => r.join('')).join('\n')
}

function makeLineChart(avgs, h){
  let chart = []
  let y = h
  while (y-->0){
    let row = []
    for (let x = avgs.length-1; x>=0; x--){
      Math.ceil(avgs[x]) === y 
        ? x<avgs.length-1 && Math.ceil(avgs[x])>Math.ceil(avgs[x+1]) 
          ? row.push('/')
          : x<avgs.length-1 && Math.ceil(avgs[x])<Math.ceil(avgs[x+1])
            ? row.push('\\') 
          : row.push('-')
        : row.push(' ')
    }
    chart.push(row)
  }
  return chart.map(r => r.join('')).join('\n')
}

function makeOHLCChart(avgs, h){
  avgs = avgs.map(c => c.map(a => Math.ceil(a)))
  let groupedData = []
  for (let val=0; val<avgs[0].length; val++){
    let tmp = []
    for (let t=0; t<avgs.length; t++){
      tmp.push(avgs[t][val])
    }
    groupedData.push(tmp)
  }
  avgs = groupedData
  let chart = []
  let charMap = {
    0: '-',
    1: '|',
    2: '|',
    3: '-'
  }
  let y = h
  while (y-->0){
    let row = []
    for (let x = avgs.length-1; x>=0; x--){
      avgs[x].includes(y) 
        ? row.push(charMap[avgs[x].indexOf(y)])
        : row.push(' ')
    }
    chart.push(row)
  }
  return chart.map(r => r.join('')).join('\n')
}

function graphArr(json, ser){
  let arr = treatData(objArr(json), ser)
  let metaData = arr.find(e => typeof e === 'string')

  const types = {
    bar: () => makeBarChart(arr[0], graphHeight) 
      + makeBarChart(arr[1], volHeight),
    line: () =>makeLineChart(arr[0], graphHeight) 
      + '\r' + makeBarChart(arr[1], volHeight),
    OHLC: () => makeOHLCChart(arr.slice(0,4), graphHeight)
      + '\r' + makeBarChart(arr[4], volHeight)
  }

  return metaData + types[ser.curTyp]()
}

module.exports = {
  objArr: objArr,
  graphArr: graphArr
}
