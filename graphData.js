module.exports = {
  objArr: objArr
}

function objArr(json){
  function findKey(o, k){
    let rgx = new RegExp(k)
    console.log( " rgx", rgx)
    return Object.keys(o).find(key => rgx.test(key))
  }

  let symKey
  let valArr = []
  if (json['Meta Data']){
    let timeKey = findKey(json['Meta Data'], '2. ')
    symKey = json['Meta Data'][timeKey] 
    let timeSeries = json[findKey(json, 'Time Series')]
      valArr = [Object.keys(timeSeries).map(k => Object.keys(timeSeries[k]).map(v => timeSeries[k][v]))]
  }
  return [symKey, ...valArr] 
}
