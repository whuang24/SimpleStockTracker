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
        ['Time', 'Price']
    ]);

    const estOptions = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }

    async function checkMarket() {
        const marketStatus = await isMarketOpen()
        setmarketStatus(marketStatus)
    }

    useEffect(() => {
        checkMarket();
        const unsubscribeListener = onSnapshot(graphDataCollection, function(snapshot) {
            const dataArray = snapshot.docs.filter(doc => (doc.id === props.symbol)).map(doc => ({
                ...doc.data().graphData
            }))[0];

            for (const key in dataArray) {
                if (dataArray.hasOwnProperty(key)) {
                    var nestedObject = dataArray[key];

                    var formatter = new Intl.DateTimeFormat('en-US', estOptions);
                    var formattedDate = formatter.format(new Date(nestedObject.time));

                    setChartData(oldData => {
                        return [
                            ...oldData,
                            [formattedDate, nestedObject.price]
                        ]
                    })
                }
            }
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
            const currTime = Date.now();
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
