import React, {useEffect, useState} from 'react'
import "../Component CSS/StockInfo.css"
import { finnhubClient, isMarketOpen } from '../finnhubService'

export default function StockInfo(props) {
    const [marketStatus, setMarketStatus] = useState(false)
    const [stockStats, setStockStats] = useState(new Map().set("Exchange", "NASDAQ"))

    async function fetchStats() {
        return new Promise((resolve, reject) => {
            finnhubClient.quote(props.symbol, (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            })
        })
    }

    async function fetchFinancials() {
        return new Promise((resolve, reject) => {
            finnhubClient.companyBasicFinancials(props.symbol, "all", (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            })
        })
    }

    function roundTo4(num) {
        return Math.round(num * 10000) / 10000
    }

    useEffect(() => {

        async function updateStats() {
            const quoteData = await fetchStats();
                setStockStats(oldStats => {
                    const newStats = new Map(oldStats);
                    newStats.set("Price", quoteData.c)
                        .set("Opening Price", quoteData.o)
                        .set("Low", quoteData.l)
                        .set("High", quoteData.h);
                    return newStats;
                });

                const financialData = await fetchFinancials();
                setStockStats(oldStats => {
                    const currentPrice = quoteData.c;
                    const peRatio = roundTo4(currentPrice / financialData.metric.epsInclExtraItemsTTM);
                    const newStats = new Map(oldStats);
                    newStats.set("52W Low", financialData.metric['52WeekLow'])
                        .set("52W High", financialData.metric['52WeekHigh'])
                        .set("Market Cap", roundTo4(financialData.metric.marketCapitalization))
                        .set("P/E Ratio", peRatio)
                        .set("Yield", roundTo4(financialData.metric.dividendYieldIndicatedAnnual))
                        .set("Company Value", roundTo4(financialData.metric.enterpriseValue));
                    return newStats;
                });
        }


        async function checkMarket() {
            const marketStatus = await isMarketOpen()
            setMarketStatus(marketStatus)
        }

        checkMarket()
        console.log(marketStatus)

        updateStats()

        if (marketStatus) {
            const intervalId = setInterval(updateStats, 15000)
            return () => clearInterval(intervalId)
        }
    }, [props.symbol])
    
    console.log(stockStats)

    const statElements = Array.from(stockStats.entries()).map(([key, value]) => {
        return <div><p className="statHolder">{key}: {value}</p></div>
    })

    return (
        <div className="infoContainer">
            {statElements}
        </div>
    )
}