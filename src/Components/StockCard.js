import React from "react"
import "../Component CSS/StockCard.css"

export default function StockCard() {
    return (
        <div className="stockCard">
            <h1 className="cardSymbol">Appl</h1>
            <div className="cardStats">
                <h2>$500</h2>
                <h3>+21</h3>
            </div>
        </div>
    )
}