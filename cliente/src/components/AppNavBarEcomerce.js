import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dropdown, Modal, Navbar } from 'react-bootstrap'
import logo from '../assets/Logo.png'
import { Link, useNavigate } from 'react-router-dom'
import FormLogin from './ecommerceComponent/FormLogin'
import AuthContext from '../context/AuthContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { AuthClientComponent } from './ecommerceComponent/AuthClientComponent'

import './AppNavBarEcomerce.css'

const AppNavBarEcomerce = () => {
  const headerRef = useRef()
  const { client, setTokenClient, setTokenAccessCliente, setClient, cartEcommerceAmericanState } =
    useContext(AuthContext)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Body>
          <FormLogin
            onHide={() => {
              setShow(false)
            }}
          />
        </Modal.Body>
      </Modal>

      <div className="header-top border-bottom py-2">
        <div className="container-lg">
          <div className="row justify-content-evenly align-items-center">
            <div className="col">
              <ul className="social-links list-unstyled d-flex m-0 text-white">
                <li className="pe-2">
                  <i className="fa-brands fa-facebook"></i>
                </li>
                <li className="pe-2">
                  <i className="fa-brands fa-instagram"></i>
                </li>
                <li>
                  <i className="fa-brands fa-whatsapp"></i>
                </li>
              </ul>
            </div>
            <div className="col d-none d-md-block">
              <p className="text-center text-light m-0">
                <strong className="text-uppercase">Envios </strong> a Todo Colombia
              </p>
            </div>
          </div>
        </div>
      </div>

      <Navbar
        expand="lg"
        className="navbar glass-navbar text-uppercase fs-6 p-3 align-items-center"
      >
        <div className="container">
          <Link to={`/`} className="navbar-brand navbar-brand-glass">
            <img src={logo} className="me-2" style={{ width: '60px' }} alt="Logo" />
            <span> American Shop</span>
          </Link>

          <Navbar.Toggle aria-controls="navbar-nav-glass" className="border-0 shadow-none" />

          <Navbar.Collapse id="navbar-nav-glass">
            <div className="d-flex justify-content-end align-items-center gap-3 w-100 mt-3 mt-lg-0">
              <Link to={`/eco/mi-carrito`} className="text-decoration-none">
                <button className="nav-action-btn">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="cart-count">{`${cartEcommerceAmericanState?.length}`}</span>
                </button>
              </Link>

              {client && (
                <Dropdown className="glass-dropdown">
                  <Dropdown.Toggle className="glass-dropdown-toggle" id="dropdown-basic">
                    {`${client?.name_client[0]}${client?.name_client[1]}`}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="glass-dropdown-menu">
                    <Link
                      className="dropdown-item glass-dropdown-item text-decoration-none"
                      to={`/eco/mis-compras`}
                    >
                      Mis Compras
                    </Link>
                    <Link
                      className="dropdown-item glass-dropdown-item text-decoration-none"
                      to={`/eco/mi-perfil`}
                    >
                      Mi Perfil
                    </Link>
                    <Dropdown.Item
                      className="glass-dropdown-item"
                      onClick={() => {
                        setTokenClient(null)
                        setTokenAccessCliente(null)
                        setClient(null)
                        navigate('/')
                      }}
                    >
                      Cerrar Session
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {!client && (
                <button
                  className="nav-action-btn"
                  onClick={() => {
                    setShow(true)
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket me-2"></i>
                  <span>Ingresar</span>
                </button>
              )}
            </div>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </>
  )
}

export default AppNavBarEcomerce
