import './App.css';
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'


function App() {
  const [watchlist, setWatchlist] = useState([])
  const [currStock, setCurrStock] = useState('')

  useEffect(() => {
    fetch('https://simple-stock-tracker-server-e58667ae419b.herokuapp.com/watchlist')
      .then(response => response.json())
      .then(data => setWatchlist(data.watchlist))
      .catch(error => console.error('Error fetching watchlist:', error));
  }, [watchlist])

  useEffect(() => {
    var body = {
      watchlist: watchlist
    }

    fetch('https://simple-stock-tracker-server-e58667ae419b.herokuapp.com/updating_watchlist', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  }, [watchlist])

  function detailSelect(symbol) {
    setCurrStock(symbol);
  }

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

    setCurrStock('')
  }


  return (
    <div className="App">
      <Watchlist
        currStock={currStock}
        detailSelect={detailSelect}
        watchlist={watchlist}
        selectWatchlist={selectWatchlist}
      />
      <Details currStock={currStock} removing={removeFromWatchlist}/>
    </div>
  );
}

export default App;
