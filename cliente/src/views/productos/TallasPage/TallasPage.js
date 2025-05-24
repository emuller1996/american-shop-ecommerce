import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import FormStock from './components/FormStock'
import { useProductos } from '../../../hooks/useProductos'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

const TallasPage = ({ idProduct }) => {
  TallasPage.propTypes = {
    idProduct: PropTypes.string,
  }
  const [draw, setDraw] = useState(0)
  const [StockSelected, setStockSelected] = useState(null)
  const { getStockByProductId, StockProduct } = useProductos()
  //const { idProduct } = useParams()

  useEffect(() => {
    getStockByProductId(idProduct)
  }, [idProduct, draw])

  return (
    <div>
      <div>
        <div className={`card card-body `}>
          <span className="text-center">Gestion de tallas</span>
          <hr />
          <div className="row  mt-3">
            <div className="col-md-5">
              {StockSelected ? (
                <FormStock
                  idProduct={idProduct}
                  StockProduct={StockSelected}
                  allStock={() => {
                    setDraw((status) => ++status)
                  }}
                  cancel={() => {
                    setStockSelected(null)
                  }}
                />
              ) : (
                <FormStock
                  idProduct={idProduct}
                  allStock={() => {
                    setDraw((status) => ++status)
                  }}
                  cancel={() => {
                    setStockSelected(null)
                  }}
                />
              )}
            </div>
            <div className="col-md-7">
              {StockProduct &&
                StockProduct.map((stock) => (
                  <div key={stock._id} className="card border mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="card-text">Talla : {stock.size}</span>
                        <span className="card-text">Stock : {stock.stock}</span>
                        <button
                          type="button"
                          onClick={() => {
                            console.log(stock)
                            setStockSelected(stock)
                          }}
                          className="btn btn-primary"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={`card card-body mt-4`}>
          <span className="text-center">Registro de Stock del Producto</span>
          <hr />
          <div className="table-responsive">
            <table className="table ">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Talla</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Descripcion</th>
                  <th scope="col">Usuario</th>
                </tr>
              </thead>
              <tbody>
                <tr className="">
                  <td scope="row">11/02/2025</td>
                  <td>M</td>
                  <td>2</td>
                  <td>SALIO</td>
                  <td>Estefano Muller</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TallasPage
