import React, {useState, useEffect} from "react"
import "../Component CSS/stockSearchbar.css"
import {searching} from "../finnhubService"

export default function StockSearchbar(props) {
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [dropdownVisible, setDropdownVisible] = useState(false);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search && search !== "") {
                searching(search).then((data) => {
                    setSuggestions(data.slice(0, 5))
                    setDropdownVisible(true)
                })
            } else {
                setSuggestions([])
                setDropdownVisible(false)
            }
        }, 500)

        return() => clearTimeout(timeoutId)
    }, [search])

    function handleSearch(input) {
        setSearch(input.target.value)
    }

    function addToSelection(event, symbol) {
        event.stopPropagation();
        props.handleSelect([symbol])
    }

    const suggestionElements = suggestions.map((suggestion) => {
        return (
            <div key={suggestion.symbol} className="searchResultItems">{suggestion.symbol} - {suggestion.name}
                <button onClick={(event) => 
                    addToSelection(event, suggestion.symbol)
                }>Add to Watchlist</button>
            </div>
        )
    })

    return (
        <div className="searchbar">
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="stockSearch"
                placeholder="Search for stock symbols to add to watchlist"
            />
            {dropdownVisible && 
                <div className="searchResults">
                    {suggestionElements}
                </div>
            }
        </div>
    )
}