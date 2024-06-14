import './App.css';
import Split from "react-split"
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"
import React, {useState, useEffect} from 'react'

function App() {
  const [currStock, setCurrStock] = useState('')
  
    function detailSelect(symbol) {
      setCurrStock(symbol);
    }

  return (
    <div className="App">
      <Split className="split">
        <Watchlist
          currStock={currStock}
          detailSelect={detailSelect}
        />
        <Details />
      </Split>
    </div>
  );
}

export default App;
