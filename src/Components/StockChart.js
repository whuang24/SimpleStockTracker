import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Chart } from 'react-google-charts'
import 'chart.js/auto'
import { isMarketOpen } from "../finnhubService";
import { onSnapshot} from "firebase/firestore";
import { graphDataCollection} from "../firebase";
import { toZonedTime} from 'date-fns-tz'

export default function StockChart(props) {
    /*Initializing the states:
        1. A state to store the status of the american stock market
        2. A state to store the data to be loaded onto the chart
        3. A state to store the customization options of the chart
    */
    const [marketStatus, setmarketStatus] = useState(true)
    const [chartData, setChartData] = useState();
    const [chartOptions, setChartOptions] = useState({
        curveType: "function",
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

    async function clearFirebase() {
        var today = new Date();
        var todayEst = new Date(Date.parse(today.toLocaleString('en-US', {timeZone: "America/New_York"})));

        if (todayEst === 0) {
            var docRef = graphDataCollection.doc(props.symbol);

            docRef.set({})
            .then(() => {
                console.log(`${props.symbol} previous week data successfully deleted`)
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }


    /*
        Function: checkMarket()
        Purpose: to check for the status of the stock market and sets the state that tracks the market status
    */
    async function checkMarket() {
        const marketStatus = await isMarketOpen();
        setmarketStatus(marketStatus);
        clearFirebase();
    }

    useEffect(() => {
        try {
            checkMarket();
            setInterval(checkMarket, 60000);
        } catch (error) { 
            if (error.message.includes('Timeout')) {
                //An issue that requires a deeper look in the future
                console.log('Timeout error occurred')
            } else {
                throw error;
            }
        }
    }, [])

    function graphAxisLabels(date) {
        var parts = date.toLocaleString().split(',')[0].split('/');
        console.log(date);
        var todayString = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;

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

    

    /*
        Function: graphSetup()
        Purpose: to set up the graph horizontal axis styling options
    */
    function graphSetup() {
        var today = new Date();
        var todayEst = new Date(Date.parse(today.toLocaleString('en-US', {timeZone: "America/New_York"})));

        var estNineThirty = new Date(Date.parse(today.toLocaleString('en-US', {timeZone: "America/New_York"})));
        estNineThirty.setHours(9, 30, 0);

        if (todayEst.getTime() < estNineThirty.getTime()) {
            todayEst.setDate(todayEst.getDate() - 1);
        }
        
        graphAxisLabels(todayEst);
    }

    useEffect(() => {
        graphSetup();
    }, [props.symbol, marketStatus])


    //Renders the stored data to the graph to be displayed
    useEffect(() => {
        const unsubscribeListener = onSnapshot(graphDataCollection, function(snapshot) {
            setChartData([['Time', 'Percentage']]);
            const dataArray = snapshot.docs.filter(doc => (doc.id === props.symbol)).map(doc => ({
                ...doc.data().graphData
            }))[0];

            var keys = []

            if (dataArray) {
                keys = Object.keys(dataArray);
                keys.sort();
            }

            const latestDate = keys.length === 0 ? 
                                new Date() :
                                new Date(keys[keys.length - 1].split('T')[0]);

            console.log(keys[keys.length - 1].split('T')[0]);
            console.log(latestDate);
            console.log(latestDate.getUTCDate());
            const latestMarketTime = latestDate.setHours(9, 30, 0, 0);

            graphAxisLabels(latestDate);

            var newData = [];

            for (var i = 0; i < keys.length; i++) {
                var nestedObject = dataArray[keys[i]];

                const est = 'America/New_York'
                const estTime = toZonedTime(nestedObject.time, est);

                const estTimestamp = estTime.getTime();

                const percentage = nestedObject.percentage;

                if (estTimestamp > latestMarketTime) {
                    newData.push([estTime, percentage])
                }
            }

            setChartData(oldData => {
                return [
                    ...oldData,
                    ...newData
                ]
            });
        })

        return unsubscribeListener;
    }, [props.symbol, marketStatus])


    return (
        <div className="chartHolder">
            <Chart 
                className="stockChart" 
                chartType="LineChart" 
                data={chartData} 
                options={chartOptions}
            />
        </div>
    )
}
