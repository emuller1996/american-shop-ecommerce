/* eslint-disable prettier/prettier */
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import AuthContext from '../../../../context/AuthContext'

export default function StockComponent({ setSizeSelected, stock, sizeSelected }) {
  StockComponent.propTypes = {
    setSizeSelected: PropTypes.func,
    sizeSelected: PropTypes.object,
    stock: PropTypes.object,
  }
  const [cantidad, setCantidad] = useState(1)
  const { cartEcommerceAmericanState } = useContext(AuthContext)

  return (
    <div key={stock._id} className="col-6 col-md-4 ">
      <div
        onClick={() => {
          stock.cantidad = 1
          setSizeSelected(stock)
        }}
        className={`${stock?._id === sizeSelected?._id ? 'StockSizeContainer_selected' : 'StockSizeContainer'} ${cartEcommerceAmericanState.find((s) => (s._id === stock?._id))?._id ? 'disabled-stock' : ''} text-center`}
      >
        <label htmlFor="">{stock?.size}</label>
        <span className="d-block" style={{ fontSize: '0.8em' }}>
          en Stock : {stock?.stock}
        </span>
        <div className="d-flex mi_input_group ">
          <button
            className="button-29 "
            onClick={() => {
              if (cantidad > 1) {
                setCantidad((status) => --status)

                setSizeSelected((prev) => ({
                  ...prev,
                  cantidad: prev.cantidad + 1,
                }))
              }
            }}
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <input
            className="input_stock"
            type="number"
            readOnly
            value={cantidad}
            min={1}
            max={stock?.stock}
          />
          <button
            className="button-29 "
            onClick={() => {
              if (cantidad < stock?.stock) {
                setCantidad((status) => ++status)
              }
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  )
}
