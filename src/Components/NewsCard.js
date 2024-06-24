import React from 'react'
import "../Component CSS/NewsCard.css"

export default function NewsCard({news}) {


    function timeDifference(timestamp) {
        const now = new Date();
        const time = new Date(timestamp * 1000);

        const difference = now - time;
        const differenceInHours = Math.floor(difference / (1000 * 60 * 60));

        if (differenceInHours > 24) {
            return `${Math.floor(differenceInHours / 24)} days ago`
        } else {
            return `${differenceInHours} hours ago`
        }
    };

    return (
        <div className="newsCard">
            <a href={news.url} target="_blank" rel="noopener noreferrer">
                {news.image && <div className="imageContainer">
                    <img className="newsImage" src={news.image} alt={news.headline}/>
                </div>}
                <div className="newsInfo">
                    <div className="source">
                        <p className="sourceName">{news.source}</p>
                        <p>-</p>
                        <p className="timeDiff">{timeDifference(news.datetime)}</p>
                    </div>
                    <h3 className="title">{news.headline}</h3>
                </div>
            </a>
        </div>
    )    
}