import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { postLoginService } from '../../services/auth.services'
import AuthContext from '../../context/AuthContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { jwtDecode } from 'jwt-decode'
import logo from '../../assets/Logo.png'
import { Spinner } from 'react-bootstrap'

const Login = () => {
  const [, setTokenAccess] = useLocalStorage('tokenAccessAmericanShop', null)
  const { setToken, setUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [errorMessage, seterrorMessage] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      setisLoading(true)
      seterrorMessage(null)
      const r = await postLoginService(data)
      console.log(r.data)
      setTokenAccess(r.data.token)
      setToken(r.data.token)
      setUser(jwtDecode(r.data.token))
      navigate('/d/dashboard')
    } catch (error) {
      console.log(error)
      if (error.response.status === 400) {
        seterrorMessage(error.response.data.message)
      }
    } finally {
      setisLoading(false)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <div className="text-center">
                    <img className="img-fluid " style={{ width: '120px' }} src={logo} />
                  </div>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="text-center mt-2">Inicio de Session</h3>
                    <p className="text-body-secondary">Ingresa con tus credenciales a tu cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('email', { required: true })}
                        placeholder="Correo Electronico"
                        autoComplete="email"
                        type="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        {...register('password', { required: true })}
                        placeholder="Contraseña"
                        autoComplete="current-password"
                      />
                    </CInputGroup>

                    <div>
                      {errorMessage && (
                        <div className="alert alert-warning" role="alert">
                          <i className="fa-solid fa-triangle-exclamation me-2"></i>
                          {errorMessage}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <CButton disabled={isLoading} color="primary" type="submit" className="px-4">
                        {isLoading ? (
                          <Spinner className="me-2" animation="border" size="sm" />
                        ) : (
                          <i className="fa-solid fa-right-to-bracket me-2"></i>
                        )}{' '}
                        Entrar
                      </CButton>
                    </div>
                    <CRow>
                      <CCol xs={6}></CCol>
                      <CCol xs={6} className="text-end">
                        <CButton color="link" className="px-0">
                          Olvide mi contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                    <div className="text-center">
                      <Link className="text-muted" to={'/'}>
                        <i className="fa-solid fa-shop me-2"></i>Volver al Tienda
                      </Link>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
