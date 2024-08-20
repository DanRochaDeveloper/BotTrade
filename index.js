require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;
const API_KEY = process.env.API_KEY;
const API_URL = "https://testnet.binance.vision/"; // API: https://api.binance.com

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 59122;
const SELL_PRICE = 59999;
const QUANTITY = "0.001"; // Valor negociável 


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

   // Utilizando valores fixos para compra e venda 

    if(price <= BUY_PRICE && isOpened === false){
     isOpened = true;
     newOrder(SYMBOL,QUANTITY,"buy");
     console.log("comprar");
 
    }else if(price >= SELL_PRICE && isOpened === true){
 
     isOpened = false;
     newOrder(SYMBOL,QUANTITY,"sell");
     console.log("vender")
 
    }else{
 
     console.log("Aguarde!")
 
    }


  // Utilizando as médias para definir compra
  /*
  if (smaThirteen > sma && isOpened === false) {
    isOpened = true;
    newOrder(SYMBOL,QUANTITY,"buy");
    console.log("comprar");

  }else if(smaThirteen < sma && isOpened === true){

    isOpened = false;
    newOrder(SYMBOL,QUANTITY,"sell");
    console.log("vender")

  }else{

    console.log("Aguarde!");

  }*/



  async function newOrder(symbol, quantity, side){

    const order = {symbol, quantity, side};
    order.type ="MARKET"; // Preço atual de mercado
    order.timestamp = Date.now();

    //Assinatura digital
    const signature = crypto.createHmac("sha256",SECRET_KEY).update(new URLSearchParams(order).toString()).digest("hex");

    //console.log("Assinatura: " + signature)

    order.signature = signature;

    //console.log("Order: " + order);

   

    try {
      
        const { data } = await axios.post( API_URL + "api/v3/order", 
          new URLSearchParams(order).toString(),
          {headers:{"X-MBX-APIKEY": API_KEY}}
        );


        console.log(data);

    } catch (error) {
       //console.log(error);
       console.error(error.response.data);
    }



  }
  // console.clear()
  //console.log(candle)

}

setInterval(start, 3000);
start();