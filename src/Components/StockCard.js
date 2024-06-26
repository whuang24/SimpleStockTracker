import React from "react"
import "../Component CSS/StockCard.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function StockCard(props) {
    
    function roundTo2(num) {
        return Math.round(num * 100) / 100
    }

    var style = {};
    if (props.data) {
        if (props.data.d !== 0) {
            style = {
                backgroundColor: props.data.d > 0 ? "rgba(11, 148, 82, 0.51)" : "rgba(166, 22, 22, 0.51)"
            }
        } else {
            style = {backgroundColor: "#242728"}
        }
    }

    return (
        <div className="stockCard" onClick={() => props.handleClick(props.symbol)}>
            <h2 className="cardSymbol">{props.symbol}</h2>
            <div className="pricingSection">
                <div className="cardPrice">
                    ${props.data && props.data.c}
                    <sub>USD</sub>
                </div>
                <div className="watchlistTrendBox" style={style}>
                    {props.data && (props.data.d >= 0?
                            <FontAwesomeIcon icon="fa-solid fa-angle-up" className="watchlistTrendArrow"/> :
                            <FontAwesomeIcon icon="fa-solid fa-angle-down" className="watchlistTrendArrow"/>)
                        }
                    <p>{props.data && roundTo2(props.data.dp)}%</p>
                </div>
            </div>
        </div>
    )
}