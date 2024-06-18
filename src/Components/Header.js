import React, {useEffect, useState} from "react"
import "../Component CSS/Header.css"
import { finnhubClient } from "../finnhubService";

export default function Header(props) {
    const [stockBasics, setStockBasics] = useState({})

    function removing(event, symbol) {
        event.stopPropagation();
    }

    useEffect(() => {
        setStockBasics(oldData => {
            return {
                ...oldData,
                symbol: props.symbol
            }
            
        })
        
        finnhubClient.quote(props.symbol, (error, data, response) => {
            setStockBasics(oldData => {
                return {
                    ...oldData,
                    currPrice: data.c,
                    currChange: data.d,
                }
            })
        })

        finnhubClient.companyProfile2({'symbol' : props.symbol}, (error, data, response) => {
            setStockBasics(oldData => {
                return {
                    ...oldData,
                    name: data.name,
                    logo: data.logo,
                }
            })
        })
    }, [props.symbol])

    console.log(stockBasics);


    return (
        <nav className="header">
            <div className="leftHeader">
                {<img className="companyLogo" src={stockBasics.logo} alt={`Logo of ${stockBasics.name}`}/>}
                <h1 className="detailName">{stockBasics.name}</h1>
                <button onClick={(event) => removing(event, stockBasics.symbol)}>Unsubscribe</button>
            </div>
            <div className="rightHeader">
                <h2 className="detailPrice">{stockBasics.currPrice}</h2>
                <h3 className="detailChange">{stockBasics.currChange}</h3>
            </div>
        </nav>
    )
}