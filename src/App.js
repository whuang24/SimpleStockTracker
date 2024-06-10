import './App.css';
import Split from "react-split"
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'
import { getStockSymbols, finnhubClient} from './finnhubService';

function App() {
  const [allStocks, setAllStocks] = useState([])
  const [currStock, setCurrStock] = useState('')
  const [watchlist, setWatchlist] = useState(['AAPL', 'MSFT', 'NVDA'])
  
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

    function detailSelect(symbol) {
      console.log(symbol);
      setCurrStock(symbol);
    }

    function selectWatchlist(arrayOfSymbols) {
      setWatchlist(oldWatchlist => {
        return [
          ...oldWatchlist,
          ...arrayOfSymbols
        ]
      })
    }

  return (
    <div className="App">
      <Split className="split">
        <Watchlist 
          allStocks={allStocks} 
          watchlist={watchlist} 
          selectWatchlist={selectWatchlist}
          currStock={currStock}
          detailSelect={detailSelect}
        />
        <Details />
      </Split>
    </div>
  );
}

export default App;
