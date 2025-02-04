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

const LandingLayout = () => {
  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  const { getAllProductos, data: Productos } = useProductos()
  const { getAllCategorias, data: Categorias } = useCategorias()

  useEffect(() => {
    getAllCategorias()
    getAllProductos()
  }, [])

  return (
    <div className="american-layout">
      <AppNavBarEcomerce />
      <div className="container mt-4">
        <div className="border p-2 rounded bg-white">
          <p className="m-0 mb-2">Filtra por Categoria</p>
          {Categorias &&
            Categorias.map((cate) => (
              <div key={cate._id} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id={cate._id}
                  value="option1"
                />
                <label className="form-check-label" htmlFor={cate._id}>
                  {cate.name}
                </label>
              </div>
            ))}

          <p className="m-0 mb-2">Filtra por Genero</p>

          <div key={'men'} className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="gender" id={'men'} value="men" />
            <label className="form-check-label" htmlFor={'men'}>
              Hombre
            </label>
          </div>
        </div>
      </div>
      <div className="container mt-3">
        <div className="row g-4">
          {Productos && Productos.map((pro) => <CardProducto key={pro._id} producto={pro} />)}
        </div>
      </div>
      <div className="container" style={{ minHeight: '50vh' }}>
        <p>QUE RARO</p>
      </div>
      <div className="container" style={{ minHeight: '50vh' }}>
        <p>QUE RARO</p>
      </div>
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
