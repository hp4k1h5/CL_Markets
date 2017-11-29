# CL_Markets
a node js command line tool to view charts from US stock markets based on time interval

### LATEST VERSION: stockCharts0.6
### DATE: 2017 11 28
### author: ROBERT WALKER

### DEPENDENCIES: NodeJS 8+
###             : Yargs

### REQUIREMENTS: Alpha Vantage API key
an API key can be requested at this adress:  https://www.alphavantage.co/support/#support
documentation can be found here: https://www.alphavantage.co/documentation/
PLEASE READ ALPHA VANTAGE's TERMS AND CONDITIONS AND ADHERE TO THEIR GUIDELINES ESPECIALLY REGARDING 
FREQUENCY OF API CALLS
there are ways to obtain high volume data streams but these must be negotiated with Alpha Vantage


## INSTALLATION INSTRUCTIONS:
### Preinstallation ritual procedures for those without node or npm else skip to 1)

1) Download a recent version of nodeJS (9 or higher is best) and make sure you can run 
   node from anywhere in your file system
2) Download npm, a node package manager or install yargs another way
3) download yargs by executing 'npm install yargs' without quotes, in your project folder (for which see INSTRUCTION 1) 

## 1) 
download or clone this repository. 

## 2)
download yargs (don't do this twice!') by typing 'npm install yargs' in your project folder

## 3) 
In the file named 'api_key.js' replace YOURAPIKEY with your api key obtained from https://www.alphavantage.co/support/#support
as outlined in the REQUIREMENTS section above

## 4)
That's basically it!
you should be able to run commands from the shell (see documentation and examples below:)

#### Test Examples
To see if things are working we can try

```
node stockCharts0.6.js --s=MSFT --i=M --z=m
  |       |             |           |     |______+
run     filename      TICKER SYM  time interval  size of graph
```

or 

```
node stockCharts0.6.js --s=BRK.A --i=15 --z=l
  |       |             |           |     |______+
run     filename      TICKER SYM  time interval  size of graph
```
you must provide a valid 1-4 letter ticker symbol but it will acommodate some deviation such as with different classes of stocks.
This has not been tested with ADR's 
This will not work for foreign markets or cyrpto currencies
(support for both in progress)

## DOCUMENTATION

this package supports 3 command line options: --s, --i, --z
| --s : | Symbol/ticker Symbol- most US NYSE/NASDAQ listings supported |
|       |  :default value : NONE (without a symbol it will not run) |
| --i : | time Interval- arguments supported : M, 1, 5, 15, 30, 60 |
|       | : M is for monthly data sets |
|       | : values 1, 5, 15, 30, 60 are for v minute data sets |
|       | : default value : 15 |
| --z : | siZe of graph- arguments supported : s, m, l |
|       | : default value : m |
note:  dealing with large charts can sometimes result in overly large charts, i have to adjust the normPrice and minMaxEq eqautions 
it is configured to use 15min and m as defaults for interval and size respectively, however you must provide a ticker symbol to look up. 

#### development plans
The longterm plan is to build a small persistent cli app that can show realtime data in the console, possibly with multiple charts and tables runnings. Some of those plans probably need a less free data source so they will wait.
In the short term, getting a small portfolio option going would be nice

## KNOWN BUGS 
when working with stocks that have risen dramatically over any time period, so say 25x over a decade or so, the graphs tend to be too large for the terminal window when --z is set to l for large 
  : the workaround is to scale the graph down to m or s 
  : the fix involves correcting the refracting equations that normalize values 
it stems from the fact that some data sets from 1 to 1.21 and others go from 44,000 to 280,000  
getting all the range of charts into one tool is tricky so please submit pull requests!

Have fun and submit bug reports above!
Thanks
