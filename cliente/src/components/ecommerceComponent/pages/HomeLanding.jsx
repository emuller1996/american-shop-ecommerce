/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import CardProducto from '../../../views/landing/components/CardProducto'
import { useProductos } from '../../../hooks/useProductos'
import { useCategorias } from '../../../hooks/useCategorias'
import Pagination from '@mui/material/Pagination'
import { Carousel } from 'react-bootstrap'
import envio_img from '../../../assets/images/envio.png'
import './HomeLanding.css'

export default function HomeLanding() {
  const { dataP: Productos, getAllProductosPublished, loading } = useProductos()
  const { getAllCategorias, data: Categorias } = useCategorias()

  const [dataFilter, setDataFilter] = useState({
    page: 1,
    perPage: 9,
    search: '',
    gender: null,
  })

  useEffect(() => {
    getAllCategorias()
  }, [])

  useEffect(() => {
    getAllProductosPublished(dataFilter)
  }, [dataFilter])
  return (
    <>
      <div className="container">
        <Carousel>
          <Carousel.Item>
            <div className="row p-5">
              <div className="mx-auto col-md-8 col-lg-6 order-lg-last">
                <img
                  className="img-fluid"
                  src="https://american-shop-eco.vercel.app/assets/img/banner_1_home.png"
                  alt=""
                />
              </div>
              <div className="col-lg-6 mb-0 d-flex align-items-center">
                <div className="text-align-left align-self-center">
                  <h1 className="h1 text-primary">
                    <b>AmericanShop</b> Comercio Electronico
                  </h1>
                  <h3 className="h2">Te Viste Real y te Deja de Paker!!</h3>
                  <p>
                    La Moda de América, en tu Hogar. Envíos Rápidos en Toda Colombia
                    <span className="d-block">
                      Descubre la Colección Exclusiva de Réplicas AAA: Lujo Auténtico a tu Alcance.
                      Explora Estilo y Calidad en Cada Detalle. ¡Bienvenido
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="row p-5">
              <div
                className="mx-auto col-md-8 col-lg-6 align-self-center"
                style={{ height: '408px' }}
              >
                <div className="d-flex  flex-column " style={{ height: '-webkit-fill-available' }}>
                  <img
                    className="img-fluid align-self-center my-auto"
                    style={{ scale: '1.2' }}
                    src={envio_img}
                    alt=""
                  />
                </div>
              </div>
              <div className="col-lg-6 mb-0 d-flex align-items-center">
                <div className="text-align-left align-self-center">
                  <h1 className="h1 text-primary">
                    <b>🚚 Envíos nacionales </b> a todo el país.
                  </h1>
                  <h3 className="h2 mb-3">¡No importa en qué parte de Colombia estés! </h3>
                  <p>
                    📦 Envíos seguros a todo el territorio colombiano Cobertura nacional garantizada
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
      <div className="container mt-4">
        <div className="border p-2 rounded bg-white">
          <p className="mb-2 mx-2 text-muted">Filtra por Categoria</p>
          <div className="mb-2 mx-2  d-flex gap-2 flex-wrap">
            <div key={'all_category'} className="form-check form-check-inline m-0 p-0">
              <input
                className="form-check-input"
                type="radio"
                name="filter_category"
                id={'all_category'}
                value={'all_category'}
                hidden
                defaultChecked={true}
                onChange={(e) => {
                  console.log(e.target.value)
                  setDataFilter((status) => {
                    return { ...status, categoy: null }
                  })
                }}
              />
              <label
                className="form-check-label"
                htmlFor={'all_category'}
                style={{
                  padding: '0.5em 0.7em',
                  borderStyle: 'solid',
                  borderColor:  dataFilter?.categoy === null ? '#5b9cff' : '#cccccc',
                  backgroundColor:  dataFilter?.categoy === null ? '#e9f2ff' : 'transparent',
                  borderWidth: '1px',
                  borderRadius: '0.4em',
                  cursor: 'pointer',
                  color: dataFilter?.categoy === null ? '#093d8b' : '#c0c0c0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {'Todas'}
              </label>
            </div>
            {Categorias &&
              Categorias.map((cate) => (
                <div key={cate._id} className="form-check form-check-inline m-0 p-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="filter_category"
                    hidden
                    id={cate._id}
                    value={cate._id}
                    onChange={(e) => {
                      console.log(e.target.value)
                      setDataFilter((status) => {
                        return { ...status, categoy: e.target.value }
                      })
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={cate._id}
                    style={{
                      padding: '0.5em 0.7em',
                      borderStyle: 'solid',
                      borderColor: cate._id === dataFilter?.categoy ? '#5b9cff' : '#cccccc',
                      backgroundColor: cate._id === dataFilter?.categoy ? '#e9f2ff' : 'transparent',
                      borderWidth: '1px',
                      borderRadius: '0.4em',
                      cursor: 'pointer',
                      color: cate._id !== dataFilter?.categoy ? '#cccccc' : '#093d8b',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {cate.name}
                  </label>
                </div>
              ))}
          </div>

          <p className="mx-2 mb-2 text-muted">Filtra por Genero</p>
          <div className="mx-2 d-flex gap-2 flex-wrap">
            <div key={'all'} className="form-check form-check-inline p-0 me-0">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                hidden
                id={'all'}
                onChange={(e) => {
                  setDataFilter((sta) => {
                    return { ...sta, gender: null }
                  })
                }}
                value="all"
              />
              <label
                className="form-check-label"
                htmlFor={'all'}
                style={{
                  padding: '0.7em',
                  borderStyle: 'solid',
                  borderColor: dataFilter?.gender === null ? '#5b9cff' : '#cccccc',
                  borderWidth: '1px',
                  borderRadius: '0.4em',
                  color: dataFilter?.gender === null ? '#5b9cff' : '#cccccc',
                  cursor: 'pointer',
                }}
              >
                <i
                  className="fa-solid fa-circle-dot me-2"
                  style={{ color: dataFilter?.gender === null ? '#5b9cff' : '#cccccc' }}
                ></i>
                Todas
              </label>
            </div>
            {['men', 'women', 'kid'].map((gen) => (
              <div key={gen} className="form-check form-check-inline p-0 me-0">
                <input
                  className="form-check-input "
                  type="radio"
                  name="gender"
                  hidden
                  id={gen}
                  value={gen}
                  onChange={(e) => {
                    setDataFilter((sta) => {
                      return { ...sta, gender: e.target.value }
                    })
                  }}
                />
                <label
                  className=""
                  style={{
                    padding: '0.7em',
                    borderStyle: 'solid',
                    borderColor: gen === dataFilter?.gender ? '#5b9cff' : '#cccccc',
                    borderWidth: '1px',
                    borderRadius: '0.4em',
                    cursor: 'pointer',
                    color: gen === dataFilter?.gender ? '#5b9cff' : '#cccccc',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  htmlFor={gen}
                >
                  {gen === 'men' && (
                    <i
                      style={{ color: gen === dataFilter?.gender ? '#5b9cff' : '#cccccc' }}
                      className="fa-solid fa-mars me-2 fa-xl"
                    ></i>
                  )}
                  {gen === 'women' && (
                    <i
                      style={{ color: gen === dataFilter?.gender ? '#5b9cff' : '#cccccc' }}
                      className="fa-solid fa-venus me-2 fa-xl"
                    ></i>
                  )}
                  {gen === 'kid' && (
                    <i
                      style={{ color: gen === dataFilter?.gender ? '#5b9cff' : '#cccccc' }}
                      className="fa-solid fa-children me-2 fa-xl"
                    ></i>
                  )}
                  {gen === 'men' && 'Hombre'}
                  {gen === 'women' && 'Mujer'}
                  {gen === 'kid' && 'Niños'}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-3 mb-2 mx-2">
            <div className="input-group ">
              <span className="input-group-text" id="basic-addon1">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="form-control form-search-eco"
                placeholder="Busca producto por Nombre, Marca, Color ... "
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  setDataFilter((status) => {
                    return { ...status, search: e.target.value }
                  })
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-3">
        <div className="row g-4">
          {!loading &&
            Productos &&
            Productos.data.map((pro) => <CardProducto key={pro._id} producto={pro} />)}
        </div>
        {!loading && Productos && Array.isArray(Productos.data) && Productos.data.length === 0 && (
          <div className="card  card-body mt-4">
            <p className="mt-3 text-center">NO SE ENCONTRARON PRODUCTOS</p>
          </div>
        )}
        {!loading && Productos && (
          <div className="card  card-body mt-4">
            <span>Total de Registros : {Productos.total} </span>
            <div className="d-flex justify-content-center">
              <Pagination
                page={dataFilter.page}
                onChange={(e, page) => {
                  setDataFilter((status) => {
                    return { ...status, page: page }
                  })
                }}
                count={Productos.total_pages}
                variant="outlined"
                shape="rounded"
              />
            </div>
          </div>
        )}
      </div>
      <div className="container" style={{ minHeight: '100px' }}>
        <p></p>
      </div>
    </>
  )
}
