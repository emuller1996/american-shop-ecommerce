import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'

const TallasPage = () => {
  const [show, setShow] = useState(false)

  return (
    <div>
      <div>
        <div className={`card card-body `}>
          <span className="text-center">Gestion de tallas</span>
          <hr />
          <div className="row  mt-3">
            <div className="col-md-5">
              <div className="card border">
                <div className="card-body">
                  <span className="text-center">Agregar Nueva Talla</span>
                  <hr />
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Talla</Form.Label>
                    <Form.Control defaultValue={''} type="text" placeholder="" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Stock o Inventario</Form.Label>
                    <Form.Control defaultValue={''} type="text" placeholder="" />
                  </Form.Group>
                  <div className="text-center">
                    <button type="button" className="btn btn-primary text-center">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="card border mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="card-text">Talla : M</span>
                      <span className="card-text">Stock : 2</span>
                      <button type="button" className="btn btn-primary">
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
