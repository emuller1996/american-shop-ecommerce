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
          <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-4 my-4 ">
            <div className="col mb-3">
              <a href="/" className="d-flex align-items-center mb-3 link-dark text-decoration-none">
                <svg className="bi me-2" width="40" height="32"></svg>
              </a>
              <p className="text-muted">© 2022</p>
            </div>

            <div className="col mb-3">
              <div className="d-flex gap-4 justify-content-center">
                <Link className="nav-link" to={`/login`}>
                  Login
                </Link>
                <Nav.Link eventKey={2} href="#memes">
                  <Link to={`/d/`}>Admin</Link>
                </Nav.Link>
              </div>
            </div>

            <div className="col mb-3">
              <h5>Section</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Home
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Productos
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Productos Nuevos
                  </a>
                </li>

                <li className="nav-item mb-2">
                  <a href="#" className="nav-link p-0 text-muted">
                    Contactanos
                  </a>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default LandingLayout
