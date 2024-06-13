// finnhubService.js
import axios from 'axios';

const API_KEY = 'cphvkspr01qjh6bhvaa0cphvkspr01qjh6bhvaag'; // Replace with your Finnhub API key

//Basic finnhub initialization
const finnhub = require('finnhub')

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = API_KEY // Replace this
export const finnhubClient = new finnhub.DefaultApi()


// General finnhub data retrieval
const finnhubApi = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: API_KEY,
  },
});

export async function getStockSymbols(exchange) {
  try {
    const response = await finnhubApi.get('/stock/symbol', {
      params: { exchange },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock symbols:', error);
    throw error;
  }
};

export async function searching(search) {
  const response = await fetch(`https://finnhub.io/api/v1/search?q=${search}&token=${API_KEY}`);
  const data = await response.json();
  return data.result.map((item) => ({
    symbol: item.symbol,
    name: item.description
  }));
}

export async function isMarketOpen() {
  const response = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${API_KEY}`);
  const data = await response.json();
  return data.isOpen;
}