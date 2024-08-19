const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 58222;
const SELL_PRICE = 58900;

const API_URL = "https://testnet.binance.vision"; // API: https://api.binance.com


let isOpened = false;


async function start() {

   const {data} = await axios.get(API_URL+"/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL);
   const candle = data[data.length - 1];
   const price  = parseFloat(candle[4]);


   if(price <= BUY_PRICE && isOpened === false){
    isOpened = true;
    console.log("comprar");

   }else if(price >= SELL_PRICE && isOpened === true){

    isOpened = false;
    console.log("vender")

   }else{

    console.log("Aguarde!")

   }

  // console.clear()
   console.log(price)
  //console.log(candle)

}

setInterval(start, 3000);
start();