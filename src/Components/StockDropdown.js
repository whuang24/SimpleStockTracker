import React, {useState} from "react"

export default function StockDropdown(props) {
    const [allStocks, setAllStocks] = useState([])
    const [selectedStocks, setSelectedStocks] = useState([])

    useState(() => {
        setAllStocks(props.allStocks)
        setSelectedStocks(props.watchlist)
    }, [])

    function selectingStock(symbol) {
        if (selectedStocks.includes(symbol)) {
            setSelectedStocks(selectedStocks.filter((selectedItem) => selectedItem.symbol !== symbol))
        } else {
            setSelectedStocks(oldSelected => {
                return [...oldSelected, symbol]
            })
        }
    }

    const dropdownElements = allStocks.map(stock => {
        return (
            <div key={stock.symbol} className="dropdown-item">
                <input
                    type="checkbox"
                    checked={selectedStocks.includes(stock.symbol)}
                    onChange={() => selectingStock(stock.symbol)}    
                />
                <label>{stock.symbol} - {stock.description}</label>
            </div>
        )
    })

    return (
        <div className="dropdown-menu">
            {dropdownElements}
        </div>
    )
}