function makeWindow(w, h){
  let arr = new Array(h - 4)
  let horizEdge = ('\r+' + '-'.repeat(w - 2) + '+').split('')
  let plane = ('\r|' + ' '.repeat(w - 2) + '|').split('')
  arr[0] = horizEdge
  arr.fill(plane, 1)
  arr.push(horizEdge)
  return arr
}

module.exports = {
  makeWindow: makeWindow
}


