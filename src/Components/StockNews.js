import React, {useEffect, useState} from 'react'
import { finnhubClient, isMarketOpen } from '../finnhubService'
import NewsCard from "./NewsCard.js"

export default function StockNews(props) {
    const [stockNews, setStockNews] = useState([])
    const [marketStatus, setMarketStatus] = useState(false)

    async function fetchNews() {
        const today = new Date().toLocaleDateString('en-CA')

        return new Promise((resolve, reject) => {
            finnhubClient.companyNews(props.symbol, today, today, (error, data, response) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(data)
                }
            })
        })
    }

    useEffect(() => {
        async function updateNews() {
            const newsData = await fetchNews()
            setStockNews(newsData)
        }

        async function checkMarket() {
            const marketStatus = await isMarketOpen();
            setMarketStatus(marketStatus);
        }

        checkMarket()
        console.log(marketStatus)

        updateNews()

        if (marketStatus) {
            const intervalId = setInterval(updateNews, 15000)
            return () => clearInterval(intervalId)
        }
    }, [props.symbol])

    const newsElements = stockNews.map(news => {
        return <NewsCard key={news.id} news={news} />;
    })


    return (
        <div className="newsContainer">
            {newsElements}
        </div>
    )
}