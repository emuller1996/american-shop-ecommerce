/* eslint-disable prettier/prettier */

import { Chip } from '@mui/material'
import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { getImageByidService } from '../../../services/images.services'
import { useState } from 'react'
import { useEffect } from 'react'

export default function CardConsulta({ consul, setShow, setConsultaSelecionada, setShowHide }) {
  const translateStatus = {
    pending: 'Pendientes',
    completed: 'Completados',
    hide: 'Ocultos',
  }

  const translateStatusClass = {
    pending: 'chip-pending',
    completed: 'chip-completed',
    hide: 'Ocultos',
  }
  const [imagesBase64, setimagesBase64] = useState(null)

  const getImage = async () => {
    try {
      const r = await getImageByidService(consul.producto.image_id)
      console.log(r.data)
      setimagesBase64(r.data.image)
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  useEffect(() => {
    if (consul.producto.image_id) {
      console.log('SI')
      getImage()
    }
  }, [])

  return (
    <div key={consul._id} className="col-md-6">
      <div
        className="card"
        style={{
          backgroundColor: consul.status === 'hide' ? '#ffd9d9' : '',
          filter: consul.status === 'hide' ? 'blur(4px)' : '',
        }}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
            <span>Fecha</span>
            <span>{new Date(consul.createdTime).toLocaleDateString()}</span>
            <ReactTimeAgo date={consul.createdTime} locale="en-US" />
          </div>
          <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
            <span>Estado</span>
            <Chip
              label={translateStatus[consul.status]}
              className={`${translateStatusClass[consul.status]}`}
              variant="outlined"
            />
          </div>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <span>Producto</span>
            <div className="d-flex align-items-center flex-column">
              {imagesBase64 && (
                <img
                  src={imagesBase64 ?? ''}
                  className="rounded-circle"
                  alt="TEST"
                  style={{ width: '80px', height: '80px' }}
                />
              )}
              <span>{consul?.producto?.name}</span>
            </div>
          </div>
          <p className="border-bottom pb-2 mb-2">{consul?.consulta}</p>
          <div className="d-flex gap-4 justify-content-center">
            <button
              onClick={() => {
                setShow(true)
                setConsultaSelecionada(consul)
                console.log(consul)
              }}
              className="btn btn-info text-white"
            >
              <i className="fa-solid fa-reply me-2"></i>Responder
            </button>
            <button
              className="btn btn-danger text-white"
              onClick={() => {
                setConsultaSelecionada(consul)
                setShowHide(true)
              }}
            >
              <i className="fa-solid fa-eye-slash me-2"></i>Ocultar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
