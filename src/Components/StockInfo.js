import React, {useEffect, useState} from 'react'
import "../Component CSS/StockInfo.css"
import { finnhubClient, isMarketOpen } from '../finnhubService'

export default function StockInfo(props) {
    const [marketStatus, setMarketStatus] = useState(false)
    const [stockStats, setStockStats] = useState(new Map())

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

    function roundTo2(num) {
        return Math.round(num * 100) / 100
    }

    useEffect(() => {

        async function updateStats() {
            const quoteData = await fetchStats();
                setStockStats(oldStats => {
                    const newStats = new Map(oldStats);
                    newStats.set("Price", `$${quoteData.c}`)
                        .set("Opening Price", `$${quoteData.o}`)
                        .set("Day Range", `$${quoteData.l} - $${quoteData.h}`)
                    return newStats;
                });

                const financialData = await fetchFinancials();
                var marketCap = 
                    financialData.metric.marketCapitalization > 1000000 ? 
                        `${roundTo2(financialData.metric.marketCapitalization / 1000)}B USD` :
                        `${roundTo2(financialData.metric.marketCapitalization)}M USD`;
                var enterpriseVal = 
                    financialData.metric.enterpriseValue > 1000000 ? 
                        `${roundTo2(financialData.metric.enterpriseValue / 1000)}B USD` :
                        `${roundTo2(financialData.metric.enterpriseValue)}M USD`;
                setStockStats(oldStats => {
                    const currentPrice = quoteData.c;
                    const peRatio = roundTo2(currentPrice / financialData.metric.epsInclExtraItemsTTM);
                    const newStats = new Map(oldStats);
                    newStats.set("52W Range", `$${financialData.metric['52WeekLow']} - $${financialData.metric['52WeekHigh']}`)
                        .set("Yield", `${roundTo2(financialData.metric.dividendYieldIndicatedAnnual)}%`)
                        .set("P/E Ratio", peRatio)
                        .set("Market Cap", marketCap)
                        .set("Company Value", enterpriseVal);
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

    const statElements = Array.from(stockStats.entries()).map(([key, value], index) => {
        return <div className="statHolder" key={key}>
                    <p className="statTitle">{key}</p>
                    <p className="stat">{value}</p>
                </div>
    })

    return (
        <div className="infoContainer">
            {statElements}
        </div>
    )
}