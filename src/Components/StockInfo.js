import React, {useEffect, useState} from 'react'
import "../Component CSS/StockInfo.css"
import { finnhubClient, isMarketOpen } from '../finnhubService'

export default function StockInfo(props) {
    const [marketStatus, setMarketStatus] = useState(false)
    const [stockStats, setStockStats] = useState(new Map().set("Exchange", "NASDAQ"))

    useEffect(() => {

        function roundTo4(num) {
            return Math.round(num * 10000) / 10000
        }

        async function updateStats() {
            finnhubClient.quote(props.symbol, (error, data, response) => {
                setStockStats(oldStats => {
                    const newStats = new Map(oldStats);
                    newStats.set("Price", data.c)
                            .set("Opening Price", data.o)
                            .set("Low", data.l)
                            .set("High", data.h)

                    return newStats
                })
            })
    
            finnhubClient.companyBasicFinancials(props.symbol, "all", (error, data, response) => {
                const peRatio = roundTo4(stockStats.get("Price") / data.metric.epsInclExtraItemsTTM)
                setStockStats(oldStats => {
                    const newStats = new Map(oldStats);
                    newStats.set("52W Low", data.metric['52WeekLow'])
                            .set("52W High", data.metric['52WeekHigh'])
                            .set("Market Cap", roundTo4(data.metric.marketCapitalization))
                            .set("P/E Ratio", peRatio)
                            .set("Yield", roundTo4(data.metric.dividendYieldIndicatedAnnual))
                            .set("Company Value", roundTo4(data.metric.enterpriseValue))
                    
                    return newStats;
                })
            })
        }

        async function checkMarket() {
            const marketStatus = await isMarketOpen();
            setMarketStatus(marketStatus);
        }

        checkMarket();
        console.log(marketStatus);

        updateStats();

        if (marketStatus) {
            const intervalId = setInterval(updateStats, 15000);
            return () => clearInterval(intervalId);
        }
    }, [props.symbol])

    const statElements = Array.from(stockStats.entries()).map(([key, value]) => {
        return <div><p className="statHolder">{key}: {value}</p></div>
    })

    return (
        <div className="infoContainer">
            {statElements}
        </div>
    )
}