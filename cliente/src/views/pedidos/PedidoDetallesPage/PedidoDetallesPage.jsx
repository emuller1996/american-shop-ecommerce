/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import { StatusOrderOptions, stylesSelect, themeSelect } from '../../../utils/optionsConfig'
import Select from 'react-select'
import { Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useOrden } from '../../../hooks/useOrden'
import { ViewDollar } from '../../../utils'

export default function PedidoDetallesPage() {
  const { idOrder } = useParams()

  const { getOrdenById, dataDetalle, loading } = useOrden()

  useEffect(() => {
    getOrdenById(idOrder)
  }, [idOrder])

  console.log(dataDetalle)

  return (
    <div>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere voluptate debitis laborum
        accusantium obcaecati saepe sit facilis! Nemo minima sint totam placeat maiores, laboriosam
        provident sed quas ipsum ipsam est.
      </p>
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div
            className="spinner-border text-primary"
            style={{ width: '3em', height: '3em' }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {dataDetalle && (
        <>
          <div className="card p-3">
            <div className="col-md-3 mx-auto">
              <Form.Label htmlFor="status">Cambiar de Estado</Form.Label>
              {dataDetalle && (
                <Select
                  name={'status'}
                  id="status"
                  placeholder=""
                  defaultValue={StatusOrderOptions.find((sta) => sta.value === dataDetalle?.status)}
                  onChange={(e) => {
                    console.log(e)
                  }}
                  styles={stylesSelect}
                  theme={themeSelect}
                  options={StatusOrderOptions}
                />
              )}
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <span className="d-flex justify-content-center text-muted">Datos de Envio</span>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <span className="">Cuidad</span>
                    <span className="">{dataDetalle?.address?.city}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Departamento</span>
                    <span className="">{dataDetalle?.address?.departament}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Direccion</span>
                    <span className="">{dataDetalle?.address?.address}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Barrio</span>
                    <span className="">{dataDetalle?.address?.neighborhood}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Referencia</span>
                    <span className="">{dataDetalle?.address?.reference}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <span className="d-flex justify-content-center text-muted">Datos de Pago</span>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <span className="">Metodo de Pago</span>
                    <span className="">TARJETA</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Estado</span>
                    <span className="">PAGADO</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Fecha</span>
                    <span className="">TEst</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Ultimos 4 Digitos de la Tarjeta</span>
                    <span className="">Inde</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">Valor Pagado</span>
                    <span className="">11213</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Precio U.</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Talla</th>
                  <th scope="col">Precio Total.</th>
                </tr>
              </thead>
              <tbody>
                {dataDetalle?.products?.map((pro) => (
                  <tr key={pro._id} className="">
                    <td width={'450px'} scope="row">
                      <div>
                        <img
                          src={pro.image}
                          alt="IMG_PRODUCT"
                          style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                        />
                        <span className="ms-3">{pro.producto_data.name}</span>
                      </div>
                    </td>
                    <td>{ViewDollar(pro.price)}</td>
                    <td>{pro.cantidad}</td>
                    <td>{pro.stock_data.size}</td>
                    <td>{ViewDollar(pro.price * pro.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
