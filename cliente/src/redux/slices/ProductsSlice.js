/* eslint-disable prettier/prettier */
// dataSlice.js
import { createSlice } from '@reduxjs/toolkit'

const ProductsSlice = createSlice({
  name: 'products',
  initialState: {
    deliveries: null,
    accountId: null,
  },
  reducers: {
    setData: (state, action) => {
      state.deliveries = action.payload
    },
    setId: (state, action) => {
      state.accountId = action.payload
    },
  },
})

export const { setData, setId } = ProductsSlice.actions
export default ProductsSlice.reducer
