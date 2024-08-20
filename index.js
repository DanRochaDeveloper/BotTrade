const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 59122;
const SELL_PRICE = 59999;

const API_URL = "https://testnet.binance.vision"; // API: https://api.binance.com


let isOpened = false;

function calcSMA(data) {
  const closes = data.map(candle => parseFloat(candle[4]));
  const sum = closes.reduce((a, b) => a + b);
  return (sum / data.length);


}

async function start() {

  const { data } = await axios.get(API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL);
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);


  console.log("Price: " + price);

  const sma = calcSMA(data);
  const smaThirteen = calcSMA(data.slice(8));

  console.log("SMA 13: " + smaThirteen);
  console.log("SMA 21: " + sma);
  console.log("IsOpened: " + isOpened)

  /* // Utilizando valores fixos para compra e venda 
  
    if(price <= BUY_PRICE && isOpened === false){
     isOpened = true;
     console.log("comprar");
 
    }else if(price >= SELL_PRICE && isOpened === true){
 
     isOpened = false;
     console.log("vender")
 
    }else{
 
     console.log("Aguarde!")
 
    }*/


  // Utilizando as médias para definir compra

  if (smaThirteen > sma && isOpened === false) {
    isOpened = true;
    console.log("comprar");

  }else if(smaThirteen < sma && isOpened === true){

    isOpened = false;
    console.log("vender")

  }else{

    console.log("Aguarde!");

  }

  // console.clear()
  console.log(price)
  //console.log(candle)

}

setInterval(start, 3000);
start();