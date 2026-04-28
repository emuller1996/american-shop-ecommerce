/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import CardProducto from '../../../views/landing/components/CardProducto'
import { useProductos } from '../../../hooks/useProductos'
import { useCategorias } from '../../../hooks/useCategorias'
import Pagination from '@mui/material/Pagination'
import { Carousel } from 'react-bootstrap'
import envio_img from '../../../assets/images/envio.png'
import { useSelector, useDispatch } from 'react-redux'

import './HomeLanding.css'
import { seFiltertData } from '../../../redux/slices/ProductsSlice'
import CardProductoHolderTest from '../../../views/landing/components/CardProductoHolderTest'

export default function HomeLanding() {
  const { dataP: Productos, getAllProductosPublished, loading, getBrandsProductos } = useProductos()
  const { getAllCategorias, data: Categorias } = useCategorias()
  const [brands, setBrands] = useState([])

  const { products, total, filterData } = useSelector((state) => state.productosPublished)
  const dispatch = useDispatch()

  useEffect(() => {
    getAllCategorias()
    
    const fetchBrands = async () => {
      try {
        const data = await getBrandsProductos()
        setBrands(data)
      } catch (error) {
        console.error('Error fetching brands:', error)
      }
    }
    fetchBrands()
  }, [])

  useEffect(() => {
    getAllProductosPublished(filterData)
  }, [filterData])

  return (
    <div className="home-landing-wrapper">
      <div className="container">
        <Carousel>
          <Carousel.Item>
            <div className="row p-5 align-items-center">
              <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                <img className="img-fluid" src="/banner_1_home.png" alt="Banner" />
              </div>
              <div className="col-lg-6">
                <div className="glass-panel carousel-glass-content animate-fade-in">
                  <h1 className="h1 text-danger">
                    <b>AmericanShop</b> Comercio Electrónico
                  </h1>
                  <h3 className="h2">Te Viste Real y te Deja de Paker!!</h3>
                  <p className="text-muted">
                    La Moda de América, en tu Hogar. Envíos Rápidos en Toda Colombia.
                    <span className="d-block mt-2">
                      Descubre la Colección Exclusiva de Réplicas AAA: Lujo Auténtico a tu Alcance.
                      Explora Estilo y Calidad en Cada Detalle. ¡Bienvenido!
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="row p-5 align-items-center">
              <div className="mx-auto col-md-8 col-lg-6 align-self-center" style={{ height: '408px' }}>
                <div className="d-flex flex-column h-100 justify-content-center">
                  <img
                    className="img-fluid align-self-center"
                    style={{ scale: '1.2' }}
                    src={envio_img}
                    alt="Envío Nacional"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="glass-panel carousel-glass-content animate-fade-in">
                  <h1 className="h1 text-danger">
                    <b>🚚 Envíos nacionales </b> a todo el país.
                  </h1>
                  <h3 className="h2 mb-3">¡No importa en qué parte de Colombia estés!</h3>
                  <p className="text-muted">
                    📦 Envíos seguros a todo el territorio colombiano. Cobertura nacional garantizada.
                    <span className="d-block mt-2">
                      Compra con tranquilidad, enviamos cada prenda hasta tu ciudad. Trabajamos con
                      las mejores transportadoras para que recibas tu pedido en 3 a 5 días hábiles.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="container mt-5">
        <div className="glass-panel filter-toolbar animate-fade-in">
          <span className="filter-section-title">Filtra por Categoría</span>
          <div className="filter-btn-group mb-4">
            <div className={`filter-pill ${filterData?.category === null ? 'active' : ''}`} 
                 onClick={() => dispatch(seFiltertData({ category: null }))}>
              Todas
            </div>
            {Categorias && Categorias.map((cate) => (
              <div 
                key={cate._id} 
                className={`filter-pill ${cate._id === filterData?.category ? 'active' : ''}`}
                onClick={() => dispatch(seFiltertData({ category: cate._id, page: 1 }))}
              >
                {cate.name}
              </div>
            ))}
          </div>

          <span className="filter-section-title">Filtra por Género</span>
          <div className="filter-btn-group mb-4">
            <div 
              className={`filter-pill ${filterData?.gender === null ? 'active' : ''}`}
              onClick={() => dispatch(seFiltertData({ gender: null, page: 1 }))}
            >
              <i className="fa-solid fa-circle-dot me-2"></i> Todas
            </div>
            {['men', 'women', 'kid'].map((gen) => (
              <div 
                key={gen} 
                className={`filter-pill ${gen === filterData?.gender ? 'active' : ''}`}
                onClick={() => dispatch(seFiltertData({ gender: gen, page: 1 }))}
              >
                {gen === 'men' && <i className="fa-solid fa-mars me-2"></i>}
                {gen === 'women' && <i className="fa-solid fa-venus me-2"></i>}
                {gen === 'kid' && <i className="fa-solid fa-children me-2"></i>}
                {gen === 'men' ? 'Hombre' : gen === 'women' ? 'Mujer' : 'Niños'}
              </div>
            ))}
          </div>

          <span className="filter-section-title">Filtra por Marca</span>
          <div className="filter-btn-group mb-4">
            <div 
              className={`filter-pill ${filterData?.brand === null ? 'active' : ''}`}
              onClick={() => dispatch(seFiltertData({ brand: null, page: 1 }))}
            >
              Todas
            </div>
            {brands && brands.map((brand) => (
              <div 
                key={brand.value} 
                className={`filter-pill ${brand.value === filterData?.brand ? 'active' : ''}`}
                onClick={() => dispatch(seFiltertData({ brand: brand.value, page: 1 }))}
              >
                {brand.value}
              </div>
            ))}
          </div>

          <div className="search-glass-group">
            <div className="search-icon-wrapper">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <input
              type="text"
              className="form-control search-glass-input"
              placeholder="Busca producto por Nombre, Marca, Color..."
              onChange={(e) => dispatch(seFiltertData({ search: e.target.value, page: 1 }))}
            />
          </div>
        </div>
      </div>

      <div className="container mt-4 product-grid-container animate-fade-in">
        <div className="row g-4">
          {loading && [1, 2, 3, 4, 5, 6, 7, 8, 9].map((lo) => <CardProductoHolderTest key={lo} />)}
          {!loading && products && products.map((pro) => <CardProducto key={pro._id} producto={pro} />)}
        </div>

        {!loading && products && Array.isArray(products) && products.length === 0 && (
          <div className="glass-panel card-body mt-4 text-center p-4">
            <p className="mb-0 text-muted">No se encontraron productos que coincidan con tu búsqueda</p>
          </div>
        )}

        {!loading && total && (
          <div className="glass-panel pagination-glass mt-4 d-flex flex-column align-items-center">
            <span className="mb-3 text-muted small">Total de Registros: {total.total}</span>
            <Pagination
              page={filterData.page}
              onChange={(e, page) => dispatch(seFiltertData({ page: page }))}
              count={total.page}
              variant="outlined"
              shape="rounded"
            />
          </div>
        )}
      </div>
      <div className="container" style={{ minHeight: '100px' }}></div>
    </div>
  )
}