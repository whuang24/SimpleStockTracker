import React, {useEffect, useState} from "react"
import "../Component CSS/StockChart.css"
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'
import { finnhubClient } from "../finnhubService";

export default function StockChart(props) {
    const [chartData, setChartData] = useState({
        labels: [],
        dataset: [
            {
                label: `${props.symbol} Stock Price`,
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }
        ]
    });

    useEffect(() => {
        
    })


    return (
        <div></div>
    )
}
