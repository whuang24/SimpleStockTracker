import React from 'react'
import "../Component CSS/NewsCard.css"

export default function NewsCard(props) {

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        return date.toLocaleString(); // Returns date and time as a string
    };

    return (
        <a className="newsCard" href={props.url} >
            <img src={props.image} alt={props.headline}/>
            <div className="newsInfo">
                <div className="source">
                    <p>{props.source}</p>
                    <p>{formatDate(props.datetime)}</p>
                </div>
                <h3 className="title">{props.headline}</h3>
                <p className="summary">{props.summary}</p>
            </div>
        </a>
    )    
}