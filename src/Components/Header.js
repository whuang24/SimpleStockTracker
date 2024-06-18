import React, {useEffect, useState} from "react"
import "../Component CSS/Header.css"
import { finnhubClient, isMarketOpen } from "../finnhubService";

export default function Header(props) {
    const [stockBasics, setStockBasics] = useState({})
    const [marketStatus, setMarketStatus] = useState(false);

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
        finnhubClient.companyProfile2({'symbol' : props.symbol}, (error, data, response) => {
            setStockBasics(oldData => {
                return {
                    ...oldData,
                    name: data.name,
                    logo: data.logo,
                }
            })
        })

        async function fetchData() {
            finnhubClient.quote(props.symbol, (error, data, response) => {
                setStockBasics(oldData => {
                    var change = data.d > 0 ? `+${data.d}` : data.d;
                    return {
                        ...oldData,
                        currPrice: data.c,
                        currChange: change,
                    }
                })
            })
        }

        async function checkMarket() {
            const marketStatus = await isMarketOpen();
            setMarketStatus(marketStatus);
        }

        checkMarket();
        console.log(marketStatus);

        fetchData();

        if (marketStatus) {
            const intervalId = setInterval(fetchData, 15000);
            return () => clearInterval(intervalId);
        }

    }, [props.symbol])

    var style = {};
    if (stockBasics.currChange) {
        if (stockBasics.currChange !== 0) {
            style = {
                color: stockBasics.currChange > 0 ? "#81c995" : "#f28b82"
            }
        } else {
            style = {color: "white"}
        }
    }

    return (
        <nav className="header">
            <div className="leftHeader">
                {<img className="companyLogo" src={stockBasics.logo} alt={`Logo of ${stockBasics.name}`}/>}
                <h1 className="detailSymbol">{stockBasics.symbol}</h1>
                <h2 className="detailName">{stockBasics.name}</h2>
                <button onClick={(event) => removing(event, stockBasics.symbol)}>Unsubscribe</button>
            </div>
            <div className="rightHeader">
                <h2 className="detailPrice">{stockBasics.currPrice}</h2>
                <h3 className="detailChange" style={style}>{stockBasics.currChange}</h3>
            </div>
        </nav>
    )
}