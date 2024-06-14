import {React, useEffect, useState} from "react"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Component CSS/Watchlist.css'
import StockCard from './StockCard'
import StockSearchbar from './stockSearchbar'
import { finnhubClient, isMarketOpen, getStockSymbols } from "../finnhubService"

library.add(fas)

export default function Watchlist(props) {
    const [watchlist, setWatchlist] = useState([]);
    const [watchlistData, setWatchlistData] = useState(new Map());
    const [marketOpen, setMarketOpen] = useState(isMarketOpen());

    useEffect(() => {
        var watchlistArray = JSON.parse(localStorage.getItem("watchlistSymbols"));
        setWatchlist(watchlistArray);
    }, [])

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

    function fetchData() {
        for (let i = 0; i < watchlist.length; i++) {
            const symbol = watchlist[i];
        
            finnhubClient.quote(symbol, (error, data, response) => {
                setWatchlistData(oldData => {
                    const newData = new Map(oldData)
                    newData.set(symbol, data)
                    return newData
                })
            })
        }
    }

    useEffect(() => {
        fetchData();

        if (marketOpen) {
            const intervalId = setInterval(fetchData, 10000);
            return () => clearInterval(intervalId);
        }
    }, [watchlist]);
    
    const stockCardElements = watchlist.map(symbol => {
        return <StockCard key={symbol} symbol={symbol} data={watchlistData.get(symbol)} handleClick={props.detailSelect}/>
    })

    return (
        <div className="watchlistContainer">
            <div className="watchlistHeader">
                <h1>Watchlist</h1>
            </div>
            <StockSearchbar watchlist={watchlist} handleSelect={selectWatchlist} />
            <div className="watchlistBody">
                {stockCardElements}
            </div>
        </div>
    )
}