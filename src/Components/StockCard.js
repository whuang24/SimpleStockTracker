import React, { useEffect, useState } from "react"
import "../Component CSS/StockCard.css"
import { finnhubClient} from "../finnhubService"

export default function StockCard(props) {

    useEffect(() => {
        
    }, [])
    

    return (
        <div className="stockCard">
            <h1 className="cardSymbol">{props.symbol}</h1>
            <div className="cardStats">
                <h2>{props.data ? props.data.c : ""}</h2>
                <h3>{props.data ? props.data.d : ""}</h3>
            </div>
        </div>
    )
}