import React, {useEffect, useState} from "react"
import "../Component CSS/Header.css"
import { finnhubClient } from "../finnhubService";

export default function Header(props) {
    const [stockBasics, setStockBasics] = useState()

    useEffect(() => {
        setStockBasics({
            symbol: props.symbol
        })
        finnhubClient.quote(props.symbol, (error, data, response) => {
            console.log(data)
            setStockBasics(oldData => {
                return {
                    ...oldData,
                    currPrice: data.c,
                    currChange: data.d,
                }
            })
        })

        finnhubClient.companyProfile2({'symbol' : props.symbol}, (error, data, response) => {
            console.log(data)
            setStockBasics(oldData => {
                return {
                    ...oldData,
                    name: data.name,
                    logo: data.logo,
                }
            })
        })

        console.log(stockBasics)
    }, [])


    return (
    <nav className="header">
        <div className="leftHeader">
            <img src={stockBasics.logo} />
            <h1>{stockBasics.name}</h1>
            <button onClick={props.removing(stockBasics.symbol)}>Unsubscribe</button>
        </div>
        <div className="rightHeader">
            <h2>{stockBasics.currPrice}</h2>
            <h3>{stockBasics.currChange}</h3>
        </div>
    </nav>)
}