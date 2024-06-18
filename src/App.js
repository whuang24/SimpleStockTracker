import './App.css';
import Split from "react-split"
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'

function App() {
  const [watchlist, setWatchlist] = useState(JSON.parse(localStorage.getItem("watchlistSymbols")))
  const [currStock, setCurrStock] = useState('')

    function detailSelect(symbol) {
      setCurrStock(symbol);
    }

    useEffect(() => {
      localStorage.setItem("watchlistSymbols", JSON.stringify(watchlist));
    }, [watchlist])

    function selectWatchlist(arrayOfSymbols) {
      setWatchlist(oldWatchlist => {
          return [
          ...arrayOfSymbols,
          ...oldWatchlist
          ]
      })
    }

    function removeFromWatchlist(symbol) {
      setWatchlist(oldWatchlist => {
        return oldWatchlist.filter(stockSymbol => stockSymbol !== symbol)
      })
    }

  return (
    <div className="App">
      <Split className="split">
        <Watchlist
          currStock={currStock}
          detailSelect={detailSelect}
          watchlist={watchlist}
          selectWatchlist={selectWatchlist}
        />
        <Details currStock={currStock} removing={removeFromWatchlist}/>
      </Split>
    </div>
  );
}

export default App;
