import {React, useEffect, useState} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../Component CSS/Watchlist.css'
import StockCard from './StockCard'
import StockDropdown from './stockDropdown'
import { finnhubClient } from "../finnhubService"

library.add(fas)

export default function Watchlist(props) {
    const [watchlistData, setWatchlistData] = useState(new Map());
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const marketUp = () => {
        const now = new Date();
        const day = now.getUTCDay();
        const hour = now.getUTCHours();
        const minute = now.getUTCMinutes();

        const marketOpenHour = 14;
        const marketCloseHour = 21;
    
        const marketOpenMinute = 30;
    
        if (day < 1 || day > 5) {
          return false;
        }
        
        if (hour < marketOpenHour || (hour === marketOpenHour && minute < marketOpenMinute) || hour > marketCloseHour) {
          return false;
        }
        
        return true;
      };

    const fetchData = async () => {
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
    }

    function toggleDropdown() {
        setDropdownVisible(!dropdownVisible);
    }

    useEffect(() => {
        fetchData();

        if (marketUp) {
            const intervalId = setInterval(fetchData, 10000);

            return () => clearInterval(intervalId);
        }
    }, []);
    

    const stockCardElements = props.watchlist.map(symbol => {
        return <StockCard key={symbol} symbol={symbol} data={watchlistData.get(symbol)} handleClick={props.detailSelect}/>
    })

    return (
        <div className="watchlistContainer">
            <div className="watchlistHeader">
                <h1>Watchlist</h1>
                <button className="addStocksBtn" onClick={toggleDropdown}>
                    {dropdownVisible ?
                        <FontAwesomeIcon icon="fa-solid fa-minus" className="fa-minus"/> :
                        <FontAwesomeIcon icon="fa-solid fa-plus" className="fa-plus"/>
                    }
                </button>
                {dropdownVisible && <StockDropdown watchlist={props.watchlist} handleSelect={props.selectWatchlist} />}
            </div>
            <div className="watchlistBody">
                {stockCardElements}
            </div>
        </div>
    )
}