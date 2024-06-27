import React, {useEffect, useState} from "react"
import "../Component CSS/Header.css"
import { finnhubClient, isMarketOpen } from "../finnhubService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Header(props) {
    const [stockBasics, setStockBasics] = useState({})
    const [marketStatus, setMarketStatus] = useState(false);

    function removing(event, symbol) {
        event.stopPropagation();
        props.removing(symbol);
    }

    function roundTo2(num) {
        return Math.round(num * 100) / 100
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
                    var change = data.d > 0 ? `+${data.d}` : data.d
                    var percentChange = data.dp > 0 ? data.dp : -data.dp
                    return {
                        ...oldData,
                        currPrice: data.c,
                        currChange: change,
                        currPercent: percentChange,
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

    var style = {}
    var trendBoxStyle = {}
    if (stockBasics.currChange) {
        if (stockBasics.currChange !== 0) {
            style = {
                color: stockBasics.currChange > 0 ? "#43CA89" : "#f28b82"
            }
            trendBoxStyle = {
                backgroundColor: stockBasics.currChange > 0 ? "#0B9452" : "rgba(166, 22, 22, 0.51)"
            }
        } else {
            style = {color: "white"}
            trendBoxStyle = {backgroundColor: "white"}
        }
    }

    return (
        <nav className="header">
            <div className="upperHeader">
                {<img 
                    className="companyLogo" 
                    src={stockBasics.logo} 
                    alt={`Logo of ${stockBasics.name}`}
                />}
                <div className="detailTitle">
                    <h1 className="detailSymbol">{stockBasics.symbol}</h1>
                    <p className="exchange">NASDAQ</p>
                </div>
                <h2 className="detailName">{stockBasics.name}</h2>
                
                <button 
                    className="unsubscribeBtn" 
                    onClick={(event) => removing(event, stockBasics.symbol)}
                >
                    <FontAwesomeIcon icon="fa-solid fa-minus" className="minusBtn"/>
                    Watchlist</button>
            </div>
            <div className="lowerHeader">
                <p className="detailPrice">${stockBasics.currPrice}</p>
                <p className="detailChange" style={style}>{stockBasics.currChange}</p>
                <div className="headerTrendBox" style={trendBoxStyle}>
                    {stockBasics && (stockBasics.currChange >= 0?
                        <FontAwesomeIcon icon="fa-solid fa-plus" className="trendArrow"/> :
                        <FontAwesomeIcon icon="fa-solid fa-minus" className="trendArrow"/>)
                    }
                    <p className="detailPercent">{roundTo2(stockBasics.currPercent)}%</p>
                </div>
            </div>
        </nav>
    )
}