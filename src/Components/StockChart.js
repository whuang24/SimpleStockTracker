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

    const chartOptions = {
        legend: 'none',
        backgroundColor: '#1F2023',
        vAxis: {
            textStyle: {
                color: "#FFFFFF"
            },
        },
        hAxis: {
            textStyle: {
                color: "#FFFFFF"
            },
            ticks: [
                [9, 0, 0, 0],
                [12, 0, 0, 0],
                [15, 0, 0, 0],
                [18, 0, 0, 0], //Current problem: need to convert the loaded data into timeOfDay objects rather than just leaving them as Date objects
                [21, 0, 0, 0],
                [24, 0, 0, 0]
            ],
            format: 'h:mm a',
        }
    };

    const estOptions = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }

    async function checkMarket() {
        const marketStatus = await isMarketOpen()
        setmarketStatus(marketStatus)
    }

    useEffect(() => {
        checkMarket();
        setInterval(checkMarket, 3600000);
    }, [])

    useEffect(() => {
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

        if (marketStatus) {
            
            const intervalId = setInterval(fetchCurrStockData, 20000)
            return () => clearInterval(intervalId)
        }
    }, [props.symbol, marketStatus]);


    return (
        <div className="chartHolder">
            <Chart className="stockChart" chartType="LineChart" data={chartData} options={chartOptions}/>
        </div>
    )
}
