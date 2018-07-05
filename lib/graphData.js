const { getDimensions, makeWindow } = require('./gui.js')

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

function graphArr(json, ser){
  if (ser.curSer === 'fx') return json

  let dimensions = getDimensions()
  let graphWidth = dimensions[0]-10
  let graphHeight = Math.floor(dimensions[1] * .75) 
  let volHeight = dimensions[1] - graphHeight

  let arr = objArr(json)

  let index = {
    stocks: [0, 1, 2, 3, 4, 5],
    digCur: [0, 1, 3, 5, 7, 9]
  }

  const types = {
    bar: barGraph,
    line: {},
    OHLC: {},
    none: () => json
  }

  function barGraph(arr){
    arr = arr[1] 
    let pLow = Math.min(...arr.map(e => e[index[ser.curSer][4]]))
    let pHigh = Math.max(...arr.map(e => e[index[ser.curSer][4]]))
    let vLow = Math.min(...arr.map(e => e[index[ser.curSer][5]]))
    let vHigh = Math.max(...arr.map(e => e[index[ser.curSer][5]]))
    let serLen = arr.length

    let pZeroVals = arr.map(e => e[index[ser.curSer][4]])
                       .map(e => e - pLow)
    let pZeroHigh = Math.max(...pZeroVals)
    let eqVal = graphHeight / pZeroHigh
    pZeroVals = pZeroVals.map(zV => zV * eqVal)

    let vZeroVals = arr.map(e => e[index[ser.curSer][5]])
                       .map(e => e - vLow)
    let vZeroHigh = Math.max(...vZeroVals)
    eqVal = volHeight / vZeroHigh
    vZeroVals = vZeroVals.map(zV => zV * eqVal)
    let eqWidth = serLen / graphWidth

    function getAvgs(arr){
      let avgs = []
      for (let p=0; p<serLen; p){
        let range = arr.slice(p, Math.ceil(p + eqWidth))
        let avg = range.reduce((a,v) => a+v) / range.length
        avgs.push(avg)
        p = Math.ceil(p + eqWidth)
      }
      return avgs
    } 

    function makeChart(avgs, h){
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
      return chart.map(r => r.join('')).join('\n')
    }

    return makeChart(getAvgs(pZeroVals), graphHeight).concat(makeChart(getAvgs(vZeroVals), volHeight))
  }

  return types[ser.curTyp](arr)
}

module.exports = {
  objArr: objArr,
  graphArr: graphArr
}
