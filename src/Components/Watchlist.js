import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Component CSS/Watchlist.css';
import StockCard from './StockCard'

library.add(fas)

export default function Watchlist(props) {
    return (
        <div className="watchlistContainer">
            <div className="watchlistHeader">
                <h1>Watchlist</h1>
                <button className="addStocksBtn">
                    <FontAwesomeIcon icon="fa-solid fa-plus" className="fa-plus"/>
                </button>
            </div>
            <div className="watchlistBody">
                <StockCard />
                <StockCard />
                <StockCard />
                <StockCard />
                <StockCard />
            </div>
        </div>
    )
}