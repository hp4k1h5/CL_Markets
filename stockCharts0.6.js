const argv = require('yargs').argv,
      sym = argv.s,
      int = (argv.i == null
                     ? 15
                     : argv.i
            ),
      size = (argv.z == null
                       ? 2
                       : argv.z == 's'
                       ? 3
                       : argv.z == 'm'
                       ? 2
                       : 1
             )

const api_key = require('./api_key.js')

const  https = require('https'),
       url = 'https://www.alphavantage.co/query?function=' +
             (int == 'M' 
              ? `TIME_SERIES_MONTHLY&symbol=${sym}`
              : `TIME_SERIES_INTRADAY&symbol=${sym}&interval=${int}min`
             ) + `&apikey=${api_key}`

https.get(url, resp => {
  let data = ''
  resp.on('data', datum => {
    data+=datum
  })
  resp.on('end', () =>{
    data = JSON.parse(data)
    let symbol = data['Meta Data']['2. Symbol'],
        refresh = data['Meta Data']['3. Last Refreshed'],
        interval =  data['Meta Data']['4. Interval'] || null,
        intKey = (interval != null ? `Time Series (${interval})` 
                                     : 'Monthly Time Series'),
        priceData = data[intKey] 

    console.log( symbol, refresh, interval, intKey)

    let low = Infinity,
        high = -low,
        prices = []

    for (let t in priceData){
      let pD = +priceData[t]['4. close']
      prices.push(pD)
      if (pD < low){
        low = pD
      }
      if (pD > high){
        high = pD
      }
    }
    console.log('L: ', low, 'H: ', high)

    let minMaxEq = 30 * Math.pow(((high-low)/low), -.8) - 1 
    let normPrice = minMaxEq/low,
        lowNormPrice = low*normPrice
    prices = prices.map(p => (normPrice*p)-lowNormPrice)

    let avgs = [],
        chunk = size,
        modLen = (prices.length%chunk==0 
                                  ? prices.length 
                                  : prices.length-(prices.length%chunk))
                                    
    for (let p=0; p<modLen; p+=chunk){
      avgs.push( prices.slice(p,p+chunk).reduce((a,v)=>a+=v)/chunk)
    }

    let chart=[],
        min = Math.min(...avgs),
        max = Math.max(...avgs),
        y = max

    while (y>0){
      let row =[]
      for (let x = avgs.length-1; x>0; x--){
        if (avgs[x]>=y){
          row.push('o')
        }
        else{
          row.push('.')
        }
      }
      chart.push(row)
      y--
    }
    chart.forEach(r=>console.log( r.join('')))
  })
}).on('error', (err) => {
  console.log('Error: ' + err.message)
})
