import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { stylesSelect, themeSelect } from '../../utils/optionsConfig'
import Select from 'react-select'
const ConsultasPages = () => {
  const [show, setShow] = useState(false)
  const [Draw, setDraw] = useState(1)

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <p className="text-center text-muted">Filtros Avanzados</p>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <div>
                <label htmlFor="gender">Estado</label>
                <Select
                  name={'gender'}
                  placeholder=""
                  onChange={(e) => {
                    console.log(e)
                    setdataFilter((status) => {
                      return { ...status, gender: e?.value ?? '' }
                    })
                  }}
                  styles={stylesSelect}
                  theme={themeSelect}
                  options={[
                    { value: 'pending', label: 'Pendientes' },
                    { value: 'completed', label: 'Completados' },
                    { value: 'hide', label: 'Ocultos' },
                  ]}
                  isClearable
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span>Fecha</span>
                <span>Hace 3 Dias</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span>Estado</span>
                <span className="badge rounded text-bg-primary">Pendiente</span>
              </div>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                <span>Producto</span>
                <div className="d-flex align-items-center flex-column">
                  <img
                    src="http://localhost:3000/src/assets/Logo.png"
                    className="rounded-circle"
                    alt="TEST"
                    style={{ width: '50px' }}
                  />
                  <span>Name Producto</span>
                </div>
              </div>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium voluptatibus
                neque quod voluptas corporis, assumenda numquam, reiciendis aperiam est fugiat
                tempore ratione soluta! Fugit iure nesciunt sapiente dolore magni eveniet.
              </p>
              <div className="d-flex gap-4 justify-content-center">
                <button className="btn btn-info text-white">
                  <i className="fa-solid fa-reply me-2"></i>Responder
                </button>
                <button className="btn btn-danger text-white">
                  <i className="fa-solid fa-eye-slash me-2"></i>Ocultar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Body>
          <FormUsuarios
            onHide={handleClose}
            allUser={() => {
              setDraw((status) => ++status)
            }}
          />
        </Modal.Body>
      </Modal> */}
    </div>
  )
}

export default ConsultasPages
