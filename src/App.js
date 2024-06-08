import './App.css';
import Split from "react-split"
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'
import axios from "axios"

function App() {
  const finnhub = require('finnhub');

  const api_key = finnhub.ApiClient.instance.authentications['api_key']
  api_key.apiKey = "<cphsbphr01qjh6bho5igcphsbphr01qjh6bho5j0>" // Replace this
  const finnhubClient = new finnhub.DefaultApi()

  async function fetchSymbols(exchange) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=${exchange}&token=cphsbphr01qjh6bho5igcphsbphr01qjh6bho5j0`);
      return response.data.map(stock => ({ symbol: stock.symbol, name: stock.description }));
    } catch (error) {
      console.error(`Error fetching symbols for ${exchange}:`, error);
      return [];
    }
  }

  async function getAllSymbols() {
    const tsxSymbols = await fetchSymbols('TSX');
    const nyseSymbols = await fetchSymbols('NYSE');
    const nasdaqSymbols = await fetchSymbols('NASDAQ');
    
    const allSymbols = [...tsxSymbols, ...nyseSymbols, ...nasdaqSymbols];
    console.log(allSymbols);
    
    return allSymbols;
  }

  console.log(getAllSymbols().then(symbols => console.log(symbols)));


  return (
    <div className="App">
      <Split className="split">
        <Watchlist />
        <Details />
      </Split>
    </div>
  );
}

export default App;
