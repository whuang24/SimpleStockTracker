import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'
import { finnhubClient, isMarketOpen } from "../finnhubService";

export default function StockChart(props) {
    const [marketOpen, setMarketOpen] = useState(false)
    const [currStock, setCurrStock] = useState(props.symbol)
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: `${props.symbol} Stock Price`,
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }
        ]
    });

    useEffect(() => {
        async function fetchCurrStockData() {
            const currTime = new Date().toLocaleTimeString();
    
            finnhubClient.quote(currStock, (error, data, response) => {
                setChartData(prevData => {
                    return {
                        ...prevData,
                        labels: [...prevData.labels, currTime],
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: [...prevData.datasets[0].data, data.c],
                            }
                        ]
                    }
                })
            })
        }

        async function checkMarket() {
            const marketStatus = await isMarketOpen();
            setMarketOpen(marketStatus);
        }

        checkMarket()

        if (marketOpen) {
            const intervalId = setInterval(fetchCurrStockData, 15000);
            return () => clearInterval(intervalId);
        }
    }, []);


    return (
        <div>
            <Line data={chartData} />
        </div>
    )
}
