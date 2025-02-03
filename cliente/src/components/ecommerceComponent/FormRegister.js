import React, { useState } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { postCreateClienteService } from '../../services/cliente.services'
import toast from 'react-hot-toast'
import { Alert, Spinner } from 'react-bootstrap'

// routes config

const FormRegister = () => {
  const [estadoFormulario, setEstadoFormulario] = useState('login')
  const [ErrorText, setErrorText] = useState({ status: false, message: '', detail: '' })
  const [SuccessText, setSuccessText] = useState({ status: false, message: '', detail: '' })
  const [isLoadingForm, setisLoadingForm] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm()
  const onSubmit = async (data) => {
    try {
      setisLoadingForm(true)
      setErrorText({
        status: false,
        message: '',
        detail: '',
      })
      const result = await postCreateClienteService(data)
      //onHide()
      toast.success(result.data.message)
      setSuccessText({
        status: true,
        message: result.data.message,
        detail: result.data.detail,
      })
      reset()
    } catch (error) {
      console.log(error)
      if (error.response.status == 400) {
        setErrorText({
          status: true,
          message: error.response.data.message,
          detail: error.response.data.detail,
        })
      }
    } finally {
      setisLoadingForm(false)
    }
  }
  return (
    <CContainer className="px-4" lg>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-center">Registrame</p>
        <div className="form-floating mb-3">
          <input
            {...register('name_client', { required: true })}
            type="text"
            className="form-control "
            id="name_client"
            placeholder=""
          />
          <label htmlFor="name_client">Nombre Completo</label>
        </div>
        <div className="form-floating mb-3">
          <input
            {...register('email_client', { required: true })}
            type="email"
            className="form-control "
            id="email_client"
            placeholder=""
          />
          <label htmlFor="email_client">Correo Electronico</label>
        </div>
        <div className="form-floating mb-3">
          <input
            {...register('phone_client', { required: true })}
            type="text"
            className="form-control "
            id="phone_client"
            placeholder=""
          />
          <label htmlFor="phone_client">Numero Telefonico</label>
        </div>
        <div className="form-floating mb-3">
          <select
            className="form-select"
            id="type_document_client"
            aria-label="Floating label select example"
            {...register('type_document_client', {
              required: true,
              validate: (s) => s !== 'Selecione una Opcion',
            })}
          >
            <option disabled selected>
              Selecione una Opcion
            </option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="PASAPORTE">PASAPORTE</option>
          </select>
          <label htmlFor="type_document_client">Tipo de Documento</label>
        </div>
        <div className="form-floating mb-3">
          <input
            {...register('number_document_client', { required: true })}
            type="text"
            className="form-control "
            id="number_document_client"
            placeholder=""
          />
          <label htmlFor="number_document_client">Numero Documento</label>
        </div>
        <div className="form-floating mb-3">
          <input
            {...register('password_client', { required: true })}
            type="password"
            className="form-control "
            id="password_client"
            placeholder=""
          />
          <label htmlFor="password_client">Contraseña</label>
        </div>
        <div className="form-check">
          <input
            {...register('is_tc', { required: true })}
            className="form-check-input"
            type="checkbox"
            value=""
            id="is_tc"
          />
          <label className="form-check-label" htmlFor="is_tc">
            Acepto los terminos y condiciones
          </label>
        </div>
        <div className="text-center">
          <button type="submit" disabled={isLoadingForm} className="button-ecomerce">
            {isLoadingForm ? (
              <>
                <div className="px-3 mx-3">
                  <Spinner animation="border" size="sm" />
                </div>
              </>
            ) : (
              'Registrame'
            )}
          </button>
        </div>
        <div>
          {ErrorText.status && (
            <>
              <Alert className="mt-4" key={'warning'} variant={'warning'}>
                <Alert.Heading>{ErrorText?.message}</Alert.Heading>
                <p>{ErrorText?.detail}</p>
              </Alert>
            </>
          )}
          {SuccessText.status && (
            <>
              <Alert className="mt-4" key={'success'} variant={'success'}>
                <Alert.Heading>{SuccessText?.message}</Alert.Heading>
                <p>{SuccessText?.detail}</p>
              </Alert>
            </>
          )}
        </div>
        <div className="mt-4">
          <p className="text-muted">TE VISTE REAL Y TE DEJA DE PAKER</p>
        </div>
      </form>
    </CContainer>
  )
}

export default FormRegister
