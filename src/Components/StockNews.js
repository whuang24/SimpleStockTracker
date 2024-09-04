import React, {useEffect, useState} from 'react'
import { finnhubClient, isMarketOpen } from '../finnhubService'
import NewsCard from "./NewsCard.js"
import "../Component CSS/StockNews.css"

export default function StockNews(props) {
    const [stockNews, setStockNews] = useState([])
    const [marketStatus, setMarketStatus] = useState(false)

    async function fetchNews() {
        const today = new Date()
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - 3);
        
        const todayString = today.toLocaleDateString('en-CA')
        const pastString = pastDate.toLocaleDateString('en-CA')

        return new Promise((resolve, reject) => {
            finnhubClient.companyNews(props.symbol, pastString, todayString, (error, data, response) => {
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
            setStockNews(newsData.slice(0, 10))
        }

        async function checkMarket() {
            const marketStatus = await isMarketOpen();
            setMarketStatus(marketStatus);
        }

        checkMarket()

        
        updateNews()

        if (marketStatus) {
            const intervalId = setInterval(updateNews, 15000)
            return () => clearInterval(intervalId)
        }
    }, [props.symbol])

    const newsElements = stockNews.map(news => {
        return <NewsCard key={news.id} news={news}/>;
    })


    return (
        <div className="newsContainer">
            {newsElements}
        </div>
    )
}