import './App.css';
import Split from "react-split"
import Watchlist from "./Components/Watchlist"
import Details from "./Components/Details"

function App() {
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
