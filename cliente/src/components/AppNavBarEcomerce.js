import React, { useContext, useEffect, useRef, useState } from 'react'
import { Container, Dropdown, Modal, Nav, Navbar } from 'react-bootstrap'
import logo from '../assets/Logo.png'
import { Link } from 'react-router-dom'
import FormLogin from './ecommerceComponent/FormLogin'
import AuthContext from '../context/AuthContext'

const AppNavBarEcomerce = () => {
  const headerRef = useRef()
  const { client, setTokenClient, setTokenAccessCliente, setClient } = useContext(AuthContext)

  console.log(client)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Modal size="lg" centered show={show} onHide={handleClose}>
        <Modal.Body>
          <FormLogin />
        </Modal.Body>
      </Modal>
      <div className="header-top border-bottom py-2" style={{ backgroundColor: '#b3cef5' }}>
        <div className="container-lg">
          <div className="row justify-content-evenly">
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
                <strong>Envios </strong> a Todo Colombia
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg bg-white text-uppercase fs-6 p-3 border-bottom align-items-center ">
        <div className="container">
          <div className="row justify-content-between align-items-center w-100">
            <div className="col-auto">
              <Link to={``} className="navbar-brand text-dark">
                <img src={logo} className="me-2" style={{ width: '60px' }} />
                <span className=""> American Shop</span>
              </Link>
            </div>

            <div className="col-3 col-lg-auto">
              <ul className="list-unstyled d-flex m-0 justify-content-end">
                <li className="d-none d-lg-block">
                  <button
                    className="btn text-uppercase mx-3 cursor-pointer"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                    onClick={() => {}}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span className="cart-count text-nowrap ">(0)</span>
                  </button>
                </li>
                {client ? (
                  <>
                    <Dropdown className="d-none d-lg-block">
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                        {client?.name_client}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Mis Compras</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Mi Perfil</Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setTokenClient(null)
                            setTokenAccessCliente(null)
                            setClient(null)
                          }}
                        >
                          Cerrar Session
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <li className="d-none d-lg-block">
                      <button
                        className="btn text-uppercase mx-3 cursor-pointer"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasCart"
                        aria-controls="offcanvasCart"
                        onClick={() => {
                          setShow(true)
                        }}
                      >
                        <i className="fa-solid fa-right-to-bracket me-2"></i>
                        <span className="cart-count">Ingresar</span>
                      </button>
                    </li>
                  </>
                )}

                <li className="d-lg-none">
                  <button
                    className="btn text-uppercase text-nowrap mx-3 cursor-pointer"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasCart"
                    aria-controls="offcanvasCart"
                    onClick={() => {}}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span className="cart-count ">(0)</span>
                  </button>
                </li>
                <li className="d-lg-none">
                  {client ? (
                    <>
                      <Dropdown className="">
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                          {`${client?.name_client[0]}${client?.name_client[1]}`}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href="#/action-1">Mis Compras</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Mi Perfil</Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setTokenClient(null)
                              setTokenAccessCliente(null)
                              setClient(null)
                            }}
                          >
                            Cerrar Session
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  ) : (
                    <button
                      className="btn text-uppercase mx-3 cursor-pointer"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasCart"
                      aria-controls="offcanvasCart"
                      onClick={() => {
                        setShow(true)
                      }}
                    >
                      <i className="fa-solid fa-right-to-bracket me-2"></i>
                      <span className="cart-count"></span>
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default AppNavBarEcomerce
