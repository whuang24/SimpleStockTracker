import './App.css';
import Split from "react-split"
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'
import { getStockSymbols, getCompanyProfile } from './finnhubService';

function App() {
  const [allStocks, setAllStocks] = useState([])
  const [currStock, setCurrStock] = useState({})
  
    useEffect(() => {
      async function LoadData() {
        try {
          const usSymbols = await getStockSymbols('US')
          
          setAllStocks(usSymbols)
        } catch (error) {
          console.error("error fetching data:", error)
        }
      }
      
      LoadData();
    }, [])


  // const finnhub = require('finnhub');
  // const api_key = finnhub.ApiClient.instance.authentications['api_key']
  // api_key.apiKey = "cphvkspr01qjh6bhvaa0cphvkspr01qjh6bhvaag" // Replace this
  // const finnhubClient = new finnhub.DefaultApi()

  // finnhubClient.stockSymbols("US", (error, data, response) => {
  //   console.log(data);
  // })

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
