import React from "react"
import '../Component CSS/Details.css';
import { finnhubClient } from "../finnhubService";
import StockChart from "./StockChart"
import Header from "./Header"
import StockInfo from "./StockInfo"

export default function Details(props) {

    return (
        <div className="details">
        {props.currStock !== "" ? 
            <div className="detailsContainer">
                <Header symbol={props.currStock} removing={props.removing}/>
                <StockChart symbol={props.currStock}/> 
                <StockInfo symbol={props.currStock} />
            </div>:
            <h1>Please select a stock</h1>
        }
        </div>
    )
}