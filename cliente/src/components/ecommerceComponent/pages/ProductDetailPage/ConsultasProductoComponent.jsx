/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../../context/AuthContext'
import { useProductos } from '../../../../hooks/useProductos'
import toast from 'react-hot-toast'
export default function ConsultasProductoComponent({ productId }) {
  const { client } = useContext(AuthContext)
  const { ConsultasProduct, getConsultakByProductId, createConsultaProducto } = useProductos()

  const [consultaSend, setConsultaSend] = useState('second')

  console.log(client)

  useEffect(() => {
    getConsultakByProductId(productId)
  }, [productId])

  const handleSendConsulta = async () => {
    try {
      console.log({
        product_id: productId,
        consulta: consultaSend,
      })
      await createConsultaProducto({
        product_id: productId,
        consulta: consultaSend,
      })
      toast.success(`Consulta Creada Satisfactoriamente.`, { duration: 2000 })
      setConsultaSend('')
      await getConsultakByProductId(productId)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="card">
        <div className="card-body">
          <p className="m-0 mb-3 text-center text-capitalize">Consultas acerca del producto.</p>
          <div className="row g-3 mb-3">
            {ConsultasProduct &&
              ConsultasProduct.map((consul) => (
                <div key={consul._id} className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <span className="card-title">Usuario</span>
                      <p className="card-text">{consul?.consulta}</p>
                    </div>
                  </div>
                </div>
              ))}
            {ConsultasProduct && ConsultasProduct.length === 0 && (
              <>
                <p>No hay consulta para este producto.</p>
              </>
            )}
            {/*  <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Usuario</span>
                  <p className="card-text">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam optio
                    incidunt possimus, id nostrum earum! Labore deleniti asperiores itaque modi in
                    fugit, natus illum nostrum, sunt sint impedit rerum nemo.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Usuario</span>
                  <p className="card-text">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam optio
                    incidunt possimus, id nostrum earum! Labore deleniti asperiores itaque modi in
                    fugit, natus illum nostrum, sunt sint impedit rerum nemo.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Usuario</span>
                  <p className="card-text">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam optio
                    incidunt possimus, id nostrum earum! Labore deleniti asperiores itaque modi in
                    fugit, natus illum nostrum, sunt sint impedit rerum nemo.
                  </p>
                </div>
              </div>
            </div> */}
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div className="w-100" style={{ filter: `blur(${client ? '0px' : '2px'})` }}>
              <div className="">
                <textarea
                  value={consultaSend}
                  onChange={(e) => {
                    setConsultaSend(e.target.value)
                  }}
                  className="form-control"
                  name=""
                  id=""
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className=" flex-shrink-1 ">
              <button
                disabled={client ? false : true}
                style={{ height: '88px' }}
                type="button"
                className=" btn btn-primary"
                onClick={handleSendConsulta}
              >
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
