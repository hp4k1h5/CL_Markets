# CL_Markets
a node.js command line tool to view charts from US stock markets

(screen shot)[img/rht15.png]

### LATEST VERSION: stockCharts0.9
##### DATE: 2017 11 28

#### DEPENDENCIES
##### : NodeJS 8+
##### : Yargs

### REQUIREMENTS: Alpha Vantage API key
an API key can be requested at this adress:  https://www.alphavantage.co/support/#support

documentation can be found here: https://www.alphavantage.co/documentation/

#### PLEASE READ ALPHA VANTAGE's TERMS AND CONDITIONS AND ADHERE TO THEIR GUIDELINES ESPECIALLY REGARDING FREQUENCY OF API CALLS

there are ways to obtain high volume data streams but these must be negotiated with Alpha Vantage


## INSTALLATION INSTRUCTIONS:
### Preinstallation ritual procedures for those without node or npm, else skip to 1)

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
node stockCharts0.7.js --s=MSFT --i=M 
  |       |             |           |
run     filename      TICKER SYM  time interval
```

or 

```
node stockCharts0.7.js --s=BRK.A --i=15 
  |       |             |           |     
run     filename      TICKER SYM  time interval
```
```
node stockCharts0.7.js --s==X
node stockCharts0.7.js --s=YHOO --i=5
node stockCharts0.7.js --s=YHOO --i=60
```
(screen shot)[img/rht15.png]
(screen shot)[img/rhtM.png]

you must provide a valid 1-4 letter ticker symbol but it will acommodate some deviation such as with different classes of stocks.

This has not been tested with ADR's 

This will not work for foreign markets or cyrpto currencies
(support for both in progress)

## DOCUMENTATION

```
this package supports 2 command line options: --s, --i
| --s : | Symbol/ticker Symbol- most US NYSE/NASDAQ listings supported |
|       |  :default value : NONE (without a symbol it will not run) |
| --i : | time Interval- arguments supported : M, 1, 5, 15, 30, 60 |
|       | : M is for monthly data sets |
|       | : values 1, 5, 15, 30, 60 are for v minute data sets |
|       | : default value : 15 |
```

it is configured to use 15min as default for interval respectively, however you must provide a ticker symbol to look up. 

#### development plans
The longterm plan is to build a small persistent cli app that can show realtime data in the console, possibly with multiple charts and tables runnings. Some of those plans probably need a less free data source so they will wait.

In the short term, getting a small portfolio option going would be nice

## KNOWN BUGS 
please submit bug reports!
