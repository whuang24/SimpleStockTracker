import React, {useState} from 'react'
import "../Component CSS/NewsCard.css"

export default function NewsCard(props) {
    const [news, SetNews] = useState(props.news);

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    return (
        <a className="newsCard" href={news.url} >
            <img src={props.image} alt={news.headline}/>
            <div className="newsInfo">
                <div className="source">
                    <p>{news.source}</p>
                    <p>{formatDate(news.datetime)}</p>
                </div>
                <h3 className="title">{news.headline}</h3>
                <p className="summary">{news.summary}</p>
            </div>
        </a>
    )    
}