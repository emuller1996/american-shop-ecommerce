/* eslint-disable prettier/prettier */
import React from 'react'
export default function ConsultasProductoComponent(second) {
  return (
    <>
      <div className="card">
        <div className="card-body">
          <p className='m-0 mb-3 text-center text-capitalize'>Consultas acerca del producto.</p>
          <div className="row g-3 mb-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Usuario</span>
                  <p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam optio incidunt possimus, id nostrum earum! Labore deleniti asperiores itaque modi in fugit, natus illum nostrum, sunt sint impedit rerum nemo.</p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Usuario</span>
                  <p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam optio incidunt possimus, id nostrum earum! Labore deleniti asperiores itaque modi in fugit, natus illum nostrum, sunt sint impedit rerum nemo.</p>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <span className="card-title">Usuario</span>
                  <p className="card-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam optio incidunt possimus, id nostrum earum! Labore deleniti asperiores itaque modi in fugit, natus illum nostrum, sunt sint impedit rerum nemo.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <div className="w-100">
              <div className="">
                <textarea className="form-control" name="" id="" rows="3"></textarea>
              </div>
            </div>
            <div className=" flex-shrink-1 ">
              <button style={{height:"88px"}} type="button" className=" btn btn-primary">
                Consultar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
