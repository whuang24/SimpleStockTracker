import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Chart } from 'react-google-charts'
import 'chart.js/auto'
import { finnhubClient, isMarketOpen } from "../finnhubService";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { graphDataCollection, db } from "../firebase";
import { toZonedTime, format} from 'date-fns-tz'

export default function StockChart(props) {
    /*Initializing the states:
        1. A state to store the status of the american stock market
        2. A state to store the data to be loaded onto the chart
        3. A state to store the customization options of the chart
    */
    const [marketStatus, setmarketStatus] = useState(true)
    const [chartData, setChartData] = useState();
    const [chartOptions, setChartOptions] = useState({
        legend: 'none',
        backgroundColor: '#1F2023',
        vAxis: {
            textStyle: {
                color: "rgba(235, 235, 235, 0.37)"
            },
            
            gridlines: {
                color: 'none',
            },
        },
        tooltip: {
            isHtml: true,
            trigger: 'focus',
        }
    })


    /*
        Function: checkMarket()
        Purpose: to check for the status of the stock market and sets the state that tracks the market status
    */
    async function checkMarket() {
        const marketStatus = await isMarketOpen();
        setmarketStatus(marketStatus);
    }

    useEffect(() => {
        checkMarket();
        setInterval(checkMarket, 60000);
    }, [])


    /*
        Function: marketOpenGraphSetup()
        Purpose: to set up the graph horizontal axis styling options
    */
    async function marketOpenGraphSetup() {
        var today = new Date();
        var todayString = today.toISOString().split('T')[0];

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
                        color: 'none',
                    },
                }
            }
        })
    }

    function isNineThirty() {
        var now = new Date();
        var est = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
        if (est.getHours() === 9 && est.getMinutes() === 30) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        async function deletePrevDayData() {
            const docRef = doc(db, "graphData", props.symbol)
            await setDoc(docRef, {});
        }

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


        setChartData([['Time', 'Percentage']]);

        if (isNineThirty() && marketStatus) {
            deletePrevDayData();
        }

        if (marketStatus) {
            marketOpenGraphSetup();
            
            const intervalId = setInterval(fetchCurrStockData, 15000)
            return () => clearInterval(intervalId)
        }
    }, [props.symbol, marketStatus]);

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
    }, [props.symbol])


    return (
        <div className="chartHolder">
            <Chart 
                className="stockChart" 
                chartType="LineChart" 
                data={chartData} 
                options={chartOptions}
                events={[
                    {
                      eventName: 'error',
                      callback: ({ chartWrapper }) => {
                        console.log("Error", chartWrapper);
                      }
                    }
                ]}
            />
        </div>
    )
}
