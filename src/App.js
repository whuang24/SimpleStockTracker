import './App.css';
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'


function App() {
  const [watchlist, setWatchlist] = useState([])
  const [currStock, setCurrStock] = useState('')
  const [initRender, setInitRender] = useState(true);

  useEffect(() => {
    fetch('https://simple-stock-tracker-server-e58667ae419b.herokuapp.com/get_watchlist')
      .then(response => response.json())
      .then((watchlist) => setWatchlist(watchlist.sort()))
      .catch(error => console.error('Error fetching watchlist:', error));
  }, [])

  useEffect(() => {
    if (initRender) {
      setInitRender(false);
      return;
    }

    const standardWatchlist = watchlist.reduce((acc, symbol) => {
      acc[symbol] = {};
      return acc;
    }, {})

    var body = {
      watchlist: standardWatchlist
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

    console.log(watchlist);
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
