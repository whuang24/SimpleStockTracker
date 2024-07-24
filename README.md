
<a id="readme-top"></a>

<br />
<div align="center">
  <a href="https://simplestocktracker.netlify.app/" target="_blank">
    <img src="public/icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Simple Stock Tracker</h3>

  <p align="center">
    A simplified stock data tracker
    <br />
    <a href="https://github.com/whuang24/ReactStockTracker/issues/new?assignees=whuang24&labels=bug&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/whuang24/ReactStockTracker/issues/new?assignees=whuang24&labels=enhancement&projects=&template=feature_request.md&title=">Request Feature</a>
  </p>
</div>


## About The Project

[![Simple Stock Tracker Screenshot][product-screenshot]](https://simplestocktracker.netlify.app/)

This stock tracker is a very simplified one that allows users to keep track of stock prices, daily price trends, some basic stock data, and most recent news articles.

This project is an ongoing one that is open for feature suggestions and expansion ideas because I want to build something more functional and capable of tracking more stock related information.

### Built With

- [![React][React.js]][React-url]
- [![Finnhub][Finnhub-icon]][Finnhub-url]
- [![Firebase][Firebase-icon]][Firebase-url]


## Project Limitations

The following is a list of the limitations that the app currently contain due to a lack of technological resources and limited financial capabilities.

* The app can only have a max of 60 API calls per minute. (Please avoid adding many stocks to watchlist or viewing details of many different stocks in a short period of time)
* The graph can only display stock data that is collected when the app is active and the specified stocks are selected in the watchlist. 
* The app is built for minimum screen width of 600px because any smaller screens would have a much more difficult time seeing the stock graph.
* The stocks that are available are only the NASDAQ and NYSE stocks.


## Getting Started

The app is accessible through the app icon above or the following URL.

<div align="center">
    <a href="https://simplestocktracker.netlify.app/" target="_blank">Simple Stock Tracker</a>
</div>


## Roadmap

- [x] Uploading basic project
- [ ] Fix bug related to graph time not being displayed properly
- [ ] Add loading spin/display to page until all content is fully loaded
- [ ] Add error detection to avoid technical errors from stopping the app
- [ ] Add API call limit detection to warn users of maxed out API call
- [ ] Add simulated investment calculation
    - [ ] Popup modal/section
    - [ ] Hypothetical investment amount
    - [ ] Hypothetical investment time
    - [ ] Hypothetical investment comparison
- [ ] Bright/Dark Modes
    - [x] Dark Mode
    - [ ] Bright Mode
    - [ ] Toggle feature
- [ ] Stock Investment advisory
    - [ ] Bullish/Bearish market indicator

See the [open issues](https://github.com/whuang24/ReactStockTracker/issues) for a full list of proposed features (and known issues).


[product-screenshot]: public/Screenshot1.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Finnhub-icon]: https://img.shields.io/badge/Finnhub-1DB954?style=for-the-badge
[Finnhub-url]: https://finnhub.io/
[Firebase-icon]: https://img.shields.io/badge/firebase-rgb(255%2C%20196%2C%200)?style=for-the-badge&logo=firebase&logoColor=%23DD2C00
[Firebase-url]: https://firebase.google.com/
