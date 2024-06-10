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
        <div className="stockCard" onClick={() => props.handleClick(props.symbol)}>
            <h2 className="cardSymbol">{props.symbol}</h2>
            <h3 className="cardPrice">${props.data && props.data.c}
                <sub>USD</sub>
            </h3>
            <div className="trendBox" style={style}>
                <h4>{props.data && props.data.d}</h4>
                {props.data && (props.data.d >= 0?
                    <FontAwesomeIcon icon="fa-solid fa-angle-up" className="trendArrow"/> :
                    <FontAwesomeIcon icon="fa-solid fa-angle-down" className="trendArrow"/>)
                    }
            </div>
        </div>
    )
}