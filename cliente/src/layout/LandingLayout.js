import React, { useEffect, useState } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Toaster } from 'react-hot-toast'
import { Card, Carousel, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Landing from '../views/landing/Landing'
import './LandingLayout.css'
import logo from '../assets/Logo.png'
import AppNavBarEcomerce from '../components/AppNavBarEcomerce'
import { useProductos } from '../hooks/useProductos'
import { ViewDollar } from '../utils'
import CardProducto from '../views/landing/components/CardProducto'
import { useCategorias } from '../hooks/useCategorias'
import AppContentLanding from '../components/ecommerceComponent/AppContentLanding'

const LandingLayout = () => {
  return (
    <div className="american-layout">
      <AppNavBarEcomerce />
      <AppContentLanding />

      <div className="bg-white border-top">
        <div className="container ">
          <footer className="row  py-4 my-4 ">
            <div className="col-md-6 mb-3">
              <h5>American Shop Vip</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Puntos de Ventas Fisicos
                  </a>
                </li>

                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Terminos y Condiciones
                  </a>
                </li>

                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Contactanos
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <Link className="text-decoration-none" to={`/d/`}>
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-6 align-self-center">
              <div className="d-flex justify-content-end">
                <img
                  width={'300px'}
                  src="https://mercadoroyal.com/assets/images/footer/lpago.png"
                />
              </div>
            </div>

            {/* <div className="col-6 mb-3">
              <div className="d-flex gap-4 justify-content-center">
                <Link className="nav-link" to={`/login`}>
                  Login
                </Link>
                <Nav.Link eventKey={2} href="#memes">
                  <Link to={`/d/`}>Admin</Link>
                </Nav.Link>
              </div>
            </div> */}
          </footer>
          <div className="py-2 " style={{ borderTop: '1px solid #e2e2e2' }}>
            <p className="text-center text-muted m-0">Amerian Shop VIP © 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingLayout
