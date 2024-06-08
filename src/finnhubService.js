// finnhubService.js
import axios from 'axios';

const API_KEY = 'cphvkspr01qjh6bhvaa0cphvkspr01qjh6bhvaag'; // Replace with your Finnhub API key

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

export const getCompanyProfile = async (symbol) => {
  try {
    const response = await finnhubApi.get('/stock/profile2', {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    throw error;
  }
};
