import React, { useEffect, useState } from "react"
import "../Component CSS/StockCard.css"
import { finnhubClient} from "../finnhubService"

export default function StockCard(props) {
    var style = {};
    if (props.data) {
        if (props.data.d !== 0) {
            style = {
                color: props.data.d > 0 ? "#81c995" : "#f28b82"
            }
        } else {
            style = {color: "white"}
        }
    }

    

    return (
        <div className="stockCard">
            <h1 className="cardSymbol">{props.symbol}</h1>
            <div className="cardStats">
                <h2>{props.data ? props.data.c : ""}</h2>
                <h3 style={style}>{props.data ? props.data.d : ""}</h3>
            </div>
        </div>
    )
}