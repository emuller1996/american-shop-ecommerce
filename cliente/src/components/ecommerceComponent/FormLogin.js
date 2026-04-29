import React, { useContext, useState } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import FormRegister from './FormRegister'
import { useForm } from 'react-hook-form'
import { postLoginClientesService } from '../../services/clientes.services'
import { Alert } from 'react-bootstrap'
import AuthContext from '../../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import './FormLogin.css'

const FormLogin = ({ onHide }) => {
  FormLogin.propTypes = {
    onHide: PropTypes.func,
  }
  const [ErrorText, setErrorText] = useState({ status: false, message: '', detail: '' })
  const [isLoadingForm, setisLoadingForm] = useState(false)
  const [estadoFormulario, setEstadoFormulario] = useState('login')
  const { setTokenClient, setTokenAccessCliente, setClient } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setisLoadingForm(true)
      setErrorText({
        status: false,
        message: '',
        detail: '',
      })
      const result = await postLoginClientesService(data)
      setTokenClient(result.data.token)
      setTokenAccessCliente(result.data.token)
      setClient(jwtDecode(result.data.token))
      onHide()
      navigate('/eco/mi-perfil')
    } catch (error) {
      console.error(error)
      const resData = error?.response?.data
      setErrorText({
        status: true,
        message: resData?.message ?? 'No se pudo iniciar sesión.',
        detail:
          resData?.detail ??
          'Verifica tu conexión e intenta de nuevo. Si el problema persiste, contáctanos.',
      })
    } finally {
      setisLoadingForm(false)
    }
  }

  return (
    <CContainer className="px-0 py-4" lg>
      {estadoFormulario === 'login' && (
        <div className="glass-form-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-center glass-form-title">Login</h2>
            
            <div className="form-floating glass-input-group">
              <input
                type="email"
                className="form-control glass-input"
                {...register('email_client', { required: true })}
                id="email_client"
                placeholder="nombre@ejemplo.com"
              />
              <label htmlFor="email_client" className="glass-input-label">
                Correo Electrónico
              </label>
            </div>

            <div className="form-floating glass-input-group">
              <input
                type="password"
                {...register('password_client', { required: true })}
                className="form-control glass-input"
                id="password_client"
                placeholder="Contraseña"
              />
              <label htmlFor="password_client" className="glass-input-label">
                Contraseña
              </label>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="button-ecomerce w-100" disabled={isLoadingForm}>
                {isLoadingForm ? (
                  <>
                    <CSpinner size="sm" className="me-2" /> Ingresando...
                  </>
                ) : (
                  'Ingresar'
                )}
              </button>
            </div>

            <div className="glass-form-footer text-center">
              <p className="m-0">
                ¿No tienes cuenta? Registrate{' '}
                <span
                  className="glass-form-link"
                  onClick={() => setEstadoFormulario('register')}
                >
                  Aquí
                </span>
              </p>
            </div>

            {ErrorText.status && (
              <div className="mt-4">
                <Alert className="glass-alert" variant="warning">
                  <Alert.Heading className="h6">{ErrorText?.message}</Alert.Heading>
                  <p className="small mb-0">{ErrorText?.detail}</p>
                </Alert>
              </div>
            )}
          </form>
        </div>
      )}

      {estadoFormulario === 'register' && <FormRegister />}
    </CContainer>
  )
}

export default FormLogin