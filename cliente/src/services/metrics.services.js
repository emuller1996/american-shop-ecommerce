/* eslint-disable prettier/prettier */
import axios from 'axios'

export const getOrdersStatsService = (token, signal) => {
  return axios.get('/metrics/orders-stats', { 
    headers: { 'access-token': token }, 
    signal: signal 
  })
}