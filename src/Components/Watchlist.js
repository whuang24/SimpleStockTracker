import {React, useEffect, useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Component CSS/Watchlist.css';
import StockCard from './StockCard'
import { finnhubClient } from "../finnhubService";

library.add(fas)

export default function Watchlist(props) {
    const [watchlistData, setWatchlistData] = useState(new Map());
    
    useEffect(() => {
        for (let i = 0; i < props.watchlist.length; i++) {
            const symbol = props.watchlist[i]
        
            finnhubClient.quote(symbol, (error, data, response) => {
                setWatchlistData(oldData => {
                    const newData = new Map(oldData)
                    newData.set(symbol, data)
                    return newData
                })
            })
        }
    }, []);
    

    const stockCardElements = props.watchlist.map(symbol => {
        return <StockCard key={symbol} symbol={symbol} data={watchlistData.get(symbol)} handleClick={props.detailSelect}/>
    })


    return (
        <div className="watchlistContainer">
            <div className="watchlistHeader">
                <h1>Watchlist</h1>
                <button className="addStocksBtn">
                    <FontAwesomeIcon icon="fa-solid fa-plus" className="fa-plus"/>
                </button>
            </div>
            <div className="watchlistBody">
                {stockCardElements}
            </div>
        </div>
    )
}