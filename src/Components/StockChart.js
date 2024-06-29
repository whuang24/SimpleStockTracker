import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Line } from 'react-chartjs-2';
import { Chart } from 'react-google-charts'
import 'chart.js/auto'
import { finnhubClient, isMarketOpen } from "../finnhubService";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { graphDataCollection, db } from "../firebase";

export default function StockChart(props) {
    const [marketStatus, setmarketStatus] = useState(false)
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

    const options = {
        legend: 'none',
        
    }

    async function checkMarket() {
        const marketStatus = await isMarketOpen()
        setmarketStatus(marketStatus)
    }

    useEffect(() => {
        checkMarket();
    }, [])

    useEffect(() => {
        async function syncWithDatabase(currTime, currPrice) {
            const docRef = doc(db, "graphData", props.symbol)
            await setDoc(docRef, {
                graphData: {
                    [new Date().toISOString()]: {
                        time: currTime,
                        price: currPrice
                    }
                }
            }, {merge: true})
        }

        async function fetchCurrStockData() {
            const currTime = new Date().toLocaleTimeString();
            finnhubClient.quote(props.symbol, (error, data, response) => {
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

                syncWithDatabase(currTime, data.c);
            })

        }

        fetchCurrStockData()

        if (marketStatus) {
            
            const intervalId = setInterval(fetchCurrStockData, 20000)
            return () => clearInterval(intervalId)
        }
    }, [props.symbol, marketStatus]);


    return (
        <div className="stockChart">
            <Line data={chartData} />
        </div>
    )
}
