import React, {useRef, useState, useEffect} from "react"
import "../Component CSS/stockSearchbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {API_KEY as token} from "../finnhubService"

export default function StockSearchbar(props) {
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdown = useRef(null);

    useEffect(() => {
        async function searching(symbol) {
            if (search && search !== "") {
                fetch(`https://finnhub.io/api/v1/search?token=${token}&q=${symbol}`)
                    .then(response => response.json())
                    .then(data => setSuggestions(data.result.filter(stock => !stock.symbol.includes('.')).slice(0, 5)))
                    .catch(error => console.log('Error:', error));
            } else {
                setSuggestions([])
                setDropdownVisible(false)
            }
            
        }

        setDropdownVisible(true)
        const timeoutId = setTimeout(() => {
            searching(search)
        }, 500)

        return() => clearTimeout(timeoutId)
    }, [search])

    function handleSearch(input) {
        setSearch(input.target.value)
    }

    function addToSelection(event, symbol) {
        event.stopPropagation()
        props.handleSelect([symbol])
        setDropdownVisible(false)
    }

    const suggestionElements = suggestions.map((suggestion) => {
        return (
            <div key={suggestion.symbol} className="searchResultItems">
                <div className="searchResultTitle">
                    <p className="resultSymbol">{suggestion.symbol}</p>
                    <p className="resultName">{suggestion.description}</p>
                </div>
                {props.watchlist.includes(suggestion.symbol) ?
                <p>Already added to the watchlist</p> :
                <button onClick={(event) => 
                    addToSelection(event, suggestion.symbol)
                }>
                    <FontAwesomeIcon icon="fa-solid fa-plus" className="addIcon"/>
                </button>}
            </div>
        )
    })

    return (
        <div className="searchbar">
            <FontAwesomeIcon icon="fas fa-search" className="searchIcon"/>
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="stockSearch"
                placeholder="Search for stock symbols"
            />
            {dropdownVisible && 
                <div className="searchResults" ref={dropdown}>
                    {suggestionElements}
                </div>
            }
        </div>
    )
}