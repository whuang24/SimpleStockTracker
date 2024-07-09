import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Chart } from 'react-google-charts'
import 'chart.js/auto'
import { finnhubClient, isMarketOpen } from "../finnhubService";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { graphDataCollection, db } from "../firebase";
import { toZonedTime, format} from 'date-fns-tz'

export default function StockChart(props) {
    const [marketStatus, setmarketStatus] = useState(false)
    const [chartData, setChartData] = useState([
        ['Time', 'Percentage']
    ]);

    const [chartOptions, setChartOptions] = useState({
        legend: 'none',
        backgroundColor: '#1F2023',
        vAxis: {
            textStyle: {
                color: "rgba(235, 235, 235, 0.37)"
            },
            
            gridlines: {
                color: 'transparent',
            },
        },
        tooltip: {
            isHtml: true,
            trigger: 'focus',
        }
    })

    async function checkMarket() {
        const marketStatus = await isMarketOpen();
        setmarketStatus(marketStatus);

        var today = new Date();
        var todayString = today.toISOString().split('T')[0];
        console.log(todayString);

        setChartOptions(oldOptions => {
            return {
                ...oldOptions,
                hAxis: {
                    textStyle: {
                        color: "rgba(235, 235, 235, 0.37)"
                    },
                    ticks: [
                        new Date(`${todayString}T09:00:00`),
                        new Date(`${todayString}T12:00:00`),
                        new Date(`${todayString}T15:00:00`),
                        new Date(`${todayString}T18:00:00`),
                    ],
                    format: 'h:mm a',
                    gridlines : {
                        color: 'transparent',
                    },
                }
            }
        })
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

                    const est = 'America/New_York'
                    const estTime = toZonedTime(nestedObject.time, est);

                    setChartData(oldData => {
                        return [
                            ...oldData,
                            [estTime, nestedObject.percentage]
                        ]
                    })
                }
            }
        })

        return unsubscribeListener;
    }, [])

    useEffect(() => {
        async function syncWithDatabase(currTime, currPercent) {
            const docRef = doc(db, "graphData", props.symbol)
            await setDoc(docRef, {
                graphData: {
                    [new Date().toISOString()]: {
                        time: currTime,
                        percentage: currPercent
                    }
                }
            }, {merge: true})
        }

        async function fetchCurrStockData() {
            const currTime = Date.now();

            finnhubClient.quote(props.symbol, (error, data, response) => {
                syncWithDatabase(currTime, data.dp);
            })
        }

        fetchCurrStockData();

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
