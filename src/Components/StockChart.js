import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Chart } from 'react-google-charts'
import 'chart.js/auto'
import { finnhubClient, isMarketOpen } from "../finnhubService";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { graphDataCollection, db } from "../firebase";

export default function StockChart(props) {
    const [marketStatus, setmarketStatus] = useState(false)
    const [chartData, setChartData] = useState([
        ['Price', 'Time']
    ]);

    async function checkMarket() {
        const marketStatus = await isMarketOpen()
        setmarketStatus(marketStatus)
    }

    useEffect(() => {
        checkMarket();
        const unsubscribeListener = onSnapshot(graphDataCollection, function(snapshot) {
            const dataArray = snapshot.docs.map(doc => ({
                ...doc.data(),
            }))
            console.log(dataArray);
        })

        return unsubscribeListener;
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
            <Chart chartType="LineChart" data={chartData} />
        </div>
    )
}
