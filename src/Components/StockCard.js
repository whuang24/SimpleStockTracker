import React from "react"
import "../Component CSS/StockCard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StockCard(props) {
    var style = {};
    if (props.data) {
        if (props.data.d !== 0) {
            style = {
                backgroundColor: props.data.d > 0 ? "#81c995" : "#f28b82"
            }
        } else {
            style = {backgroundColor: "white"}
        }
    }

    return (
        <div className="stockCard" onClick={() => props.detailSelect(props.key)}>
            <h1 className="cardSymbol">{props.symbol}</h1>
            <div className="cardStats">
                <h2 className="">{props.data && props.data.c}</h2>
                <div className="trendBox" style={style}>
                    <h3>{props.data && props.data.d}</h3>
                    {props.data && (props.data.d >= 0?
                        <FontAwesomeIcon icon="fa-solid fa-angle-up" className="trendArrow"/> :
                        <FontAwesomeIcon icon="fa-solid fa-angle-down" className="trendArrow"/>)
                        }
                </div>
            </div>
        </div>
    )
}