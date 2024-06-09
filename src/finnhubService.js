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

export const getStockSymbols = async (exchange) => {
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