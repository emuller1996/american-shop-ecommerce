/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'

import { useClientes } from '../../../../../hooks/useClientes'
import toast from 'react-hot-toast'
import PropTypes from 'prop-types'

export default function SelectAddressShop({
  setDireccionSelecionada,
  direccionSelecionada,
  setPasoActive,
}) {
  SelectAddressShop.propTypes = {
    setDireccionSelecionada: PropTypes.func,
    direccionSelecionada: PropTypes.string,
    setPasoActive: PropTypes.string,
  }

  const { getAllAddressByClientes, dataAddress } = useClientes()
  useEffect(() => {
    getAllAddressByClientes()
  }, [])

  return (
    <div className="">
      <span>Seleciona una Direcion de Envio</span>
      <div>
        {dataAddress &&
          dataAddress.map((address) => (
            <div
              key={address._id}
              onClick={() => {
                setDireccionSelecionada(address._id)
              }}
              className="card mb-2"
              style={{
                borderColor: direccionSelecionada === address._id ? 'rgb(88, 158, 255)' : '#dfdfdf',
                backgroundColor:
                  direccionSelecionada === address._id ? 'rgba(232, 242, 255, 0.61)' : '#ffffff',
                boxShadow:
                  direccionSelecionada === address._id
                    ? 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
                    : '',
                cursor: 'pointer',
              }}
            >
              <div className="card-body">
                {address?.name}
                <div>
                  {address?.departament}, {address?.city}
                </div>
                <div>
                  {address?.address}, {address?.neighborhood} ({address?.reference})
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="text-center mt-4">
        <button
          className="btn btn-success text-white"
          onClick={() => {
            if (!direccionSelecionada) {
              toast.error(`Seleciona una Direcion de Envio!`)
              return
            }
            setPasoActive('1')
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
