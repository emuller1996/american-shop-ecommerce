/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Seo from '../../Seo'
import CardProducto from '../../../views/landing/components/CardProducto'
import { useProductos } from '../../../hooks/useProductos'
import { useCategorias } from '../../../hooks/useCategorias'
import Pagination from '@mui/material/Pagination'
import { useSelector, useDispatch } from 'react-redux'

import './HomeLanding.css'
import { seFiltertData } from '../../../redux/slices/ProductsSlice'
import CardProductoHolderTest from '../../../views/landing/components/CardProductoHolderTest'
import PublicacionesCarousel from './components/PublicacionesCarousel'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'American Shop Vip',
  url: import.meta.env.VITE_SITE_URL,
  logo: `${import.meta.env.VITE_SITE_URL}/favicon.ico`,
  description:
    'Tienda online de tenis, ropa y accesorios Nike, Adidas, Jordan, Puma y Lecop Sporting. Camisetas, jeans, tenis para niños, gorras y más, con envíos a toda Colombia.',
  address: { '@type': 'PostalAddress', addressCountry: 'CO' },
}

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
      <Seo
        title="Tenis, Ropa y Accesorios Nike, Adidas, Jordan, Puma"
        description="Tienda online de tenis, ropa y accesorios Nike, Adidas, Jordan, Puma y Lecop Sporting. Camisetas, jeans, tenis para niños, gorras y más, con envíos a toda Colombia."
        path="/"
        jsonLd={organizationSchema}
      />
      <div className="container">
        <PublicacionesCarousel />
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