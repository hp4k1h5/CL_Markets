function objArr(json){
  function findKey(o, k){
    let rgx = new RegExp(k)
    return Object.keys(o).find(key => rgx.test(key))
  }

  let symKey
  let valArr = []
  if (json['Meta Data']){
    symKey = findKey(json['Meta Data'], '2. ')
    let timeSeries = json[findKey(json, 'Time Series')]
      valArr = [Object.keys(timeSeries).map(k => 
        [k].concat(Object.keys(timeSeries[k]).map(v =>
          timeSeries[k][v]
        ))
      )]
  }
  return [json['Meta Data'][symKey], ...valArr] 
}

function graphArr(json, type){
  return objArr(json)
}

module.exports = {
  objArr: objArr,
  graphArr: graphArr
}
