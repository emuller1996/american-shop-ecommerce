/* eslint-disable prettier/prettier */

import React, { useContext, useEffect } from 'react'
import FormRegister from '../../FormRegister'
import AuthContext from '../../../../context/AuthContext'
import MisDirecciones from './components/MisDirecciones'
import { useNavigate } from 'react-router-dom'

export default function MiProfilePage() {
  const { client } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <div className="container mt-5">
      {/*  <p className="text-center fs-4">Mi Perfil</p> */}
      <div className="card card-body position-relative card-cart">
        <button
          onClick={() => navigate(-1)}
          className='btn  position-absolute start-0"'
          style={{ zIndex: 10, top: '10px' }}
        >
          <i className="fa-solid fa-chevron-left me-2"></i>Atras
        </button>
        <h5 className="text-end mb-0">
          <i className="fa-solid fa-address-card me-2"></i>Mi Perfil
        </h5>
      </div>
      <p className="text-center text-muted mt-3 px-5" style={{ textWrap: 'pretty' }}>
        Hola {client?.name_client}, Bienvenido a la esa sesión para que puedes gestionar la
        información personal de ti, para poder comunicarte contigo para poder atenderte mejor.
      </p>
      <div>{client && <FormRegister client={client} />}</div>
      <MisDirecciones />
    </div>
  )
}
