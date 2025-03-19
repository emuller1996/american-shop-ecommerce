/* eslint-disable prettier/prettier */

import React, { useContext, useEffect } from 'react'
import FormRegister from '../../FormRegister'
import AuthContext from '../../../../context/AuthContext'
import MisDirecciones from './components/MisDirecciones'

export default function MiProfilePage() {
  useEffect(() => {
    console.log('raro')
  }, [])
  const { client } = useContext(AuthContext)

  return (
    <div className="container mt-5">
      <p className="text-center fs-4">Mi Perfil</p>
      <p className="">
        {client?.name_client}
        Bienvenido a la esa session para que puedeas gestionar la informacion personal de ti, para
        poder cominicarte contigo para poder atenderte mejor.
      </p>
      <div>{client && <FormRegister client={client} />}</div>
      <MisDirecciones />
    </div>
  )
}
