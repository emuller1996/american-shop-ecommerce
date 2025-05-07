/* eslint-disable prettier/prettier */
import React from 'react'
import contactanos_img from '../../assets/contactanos.jpg'
export default function ContactanosPage() {
  return (
    <>
      <h3 className="text-center mt-4">Contáctanos</h3>
      <div className="card p-4 mb-5">
        <div className="row">
          <div className="col-md-6">
            <img className="img-fluid" style={{opacity:"0.7"}} src="" alt="S" srcSet={contactanos_img} />
          </div>
          <div className="col-md-6">
            <div className="row g-3">
              <div className="col-md-12">
                <div className="">
                  <label htmlFor="name_client" className="form-label">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name_client"
                    id="name_client"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="">
                  <label htmlFor="email_client" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="email_client"
                    id="email_client"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="">
                  <label htmlFor="phone_client" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone_client"
                    id="phone_client"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="">
                  <label htmlFor="matter_client" className="form-label">
                    Asunto
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="matter_client"
                    id="matter_client"
                    placeholder=""
                  />
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <label htmlFor="message_client" className="form-label">Mensaje</label>
                  <textarea className="form-control" name="message_client" id="message_client" rows="3"></textarea>
                </div>
              </div>
            </div>
            <div className='text-center mt-3'>
                <button
                    type="button"
                    className="btn btn-primary"
                >
                    Enviar
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
