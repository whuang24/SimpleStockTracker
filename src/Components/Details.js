import React, {useState, useEffect} from "react"
import '../Component CSS/Details.css';
import { finnhubClient } from "../finnhubService";
import StockChart from "./StockChart"

export default function Watchlist(props) {
    const [stockBasics, setStockBasics] = useState({});

    useEffect(() => {
    }, [])


    return (
        <div className="detailsContainer">
            <StockChart symbol={props.currStock}/>
        </div>
    )
}