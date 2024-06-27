import {React, useEffect, useState} from "react"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Component CSS/Watchlist.css'
import StockCard from './StockCard'
import StockSearchbar from './stockSearchbar'
import { finnhubClient, isMarketOpen, getStockSymbols } from "../finnhubService"

library.add(fas)

export default function Watchlist(props) {
    const [watchlistData, setWatchlistData] = useState(new Map());
    const [marketStatus, setMarketStatus] = useState(false);

    useEffect(() => {
        async function fetchData() {
            for (let i = 0; i < props.watchlist.length; i++) {
                const symbol = props.watchlist[i];
            
                finnhubClient.quote(symbol, (error, data, response) => {
                    setWatchlistData(oldData => {
                        const newData = new Map(oldData)
                        newData.set(symbol, data)
                        return newData
                    })
                })
            }
            console.log(watchlistData);
        }

        async function checkMarket() {
            const marketStatus = await isMarketOpen();
            setMarketStatus(marketStatus);
        }

        checkMarket();
        console.log(marketStatus);

        fetchData();

        if (marketStatus) {
            const intervalId = setInterval(fetchData, 15000);
            return () => clearInterval(intervalId);
        }
    }, [props.watchlist]);
    
    const stockCardElements = props.watchlist.map(symbol => {
        return <StockCard key={symbol} symbol={symbol} data={watchlistData.get(symbol)} handleClick={props.detailSelect}/>
    })

    return (
        <div className="watchlistContainer">
            <div className="watchlistHeader">
                <h1>Watchlist</h1>
            </div>
            <StockSearchbar watchlist={props.watchlist} handleSelect={props.selectWatchlist} />
            <div className="watchlistBody">
                {stockCardElements}
            </div>
        </div>
    )
}