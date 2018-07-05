function objArr(json){
  function findKey(o, k){
    let rgx = new RegExp(k)
    return Object.keys(o).find(key => rgx.test(key))
  }

  let symKey
  let valArr
  if (json['Meta Data']){
    symKey = findKey(json['Meta Data'], '2. ')
    let timeSeries = json[findKey(json, 'Time Series')]
      valArr = Object.keys(timeSeries).map(k => 
        [k].concat(Object.keys(timeSeries[k]).map(v =>
          +timeSeries[k][v]
        ))
      )
    return [json['Meta Data'][symKey], valArr] 
  }
}

function graphArr(json, series, type, size){
  let arr = objArr(json)

  let index = {
    stocks: [0, 1, 2, 3, 4, 5],
    digCur: [0, 1, 3, 5, 7, 9]
  }

  const types = {
    bar: barGraph,
    line: {},
    OHLC: {},
  }
  this.curTyp = type && types[type] 
    ? type 
    : this.curTyp
      ? this.curTyp
      : 'bar'
  this.vol = true
  

  function barGraph(){
    let pLow = Math.min(...arr[1].map(e => e[index[series][4]]))
    let pHigh = Math.max(...arr[1].map(e => e[index[series][4]]))
    let vLow = Math.min(...arr[1].map(e => e[index[series][5]]))
    let vHigh = Math.max(...arr[1].map(e => e[index[series][5]]))
    return [pLow, pHigh, vLow, vHigh]
  }

  return types[type](arr)
}

module.exports = {
  objArr: objArr,
  graphArr: graphArr
}
