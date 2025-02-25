/* eslint-disable prettier/prettier */

import React, { useEffect } from 'react'

export default function MisComprasPages() {
  useEffect(() => {
    console.log('raro')
  }, [])
  return (
    <div className="container mt-5">
      <p className="text-center fs-4">Mis Compras</p>
      <p className="">Bienvenido a la session para que puedeas gestionar tus compras</p>
      <div className="row g-4  my-4">
        {[1, 3, 4, 6].map((c) => (
          <div key={c} className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Total $4000</h4>
                <p className="card-text">Estado</p>
                <p className="card-text">Fecha</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
