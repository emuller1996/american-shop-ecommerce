/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import CardProducto from '../../../views/landing/components/CardProducto'
import { useProductos } from '../../../hooks/useProductos'
import { useCategorias } from '../../../hooks/useCategorias'
import Pagination from '@mui/material/Pagination'
import { Carousel } from 'react-bootstrap'

export default function HomeLanding() {
  const { dataP: Productos, getAllProductosPublished, loading } = useProductos()
  const { getAllCategorias, data: Categorias } = useCategorias()

  const [dataFilter, setDataFilter] = useState({
    page: 1,
    perPage: 9,
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
              <div className="mx-auto col-md-8 col-lg-6">
                <img
                  className="img-fluid"
                  src="https://american-shop-eco.vercel.app/assets/img/banner_1_home.png"
                  alt=""
                />
              </div>
              <div className="col-lg-6 mb-0 d-flex align-items-center">
                <div className="text-align-left align-self-center">
                  <h1 className="h1 text-primary">
                    <b>Envio a </b> Toda Colombia.
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
        </Carousel>
      </div>
      <div className="container mt-4">
        <div className="border p-2 rounded bg-white">
          <p className="m-0 mb-2">Filtra por Categoria</p>
          <div key={'all_category'} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="filter_category"
              id={'all_category'}
              value={'all_category'}
              defaultChecked={true}
              onChange={(e) => {
                console.log(e.target.value)
                setDataFilter((status) => {
                  return { ...status, categoy: null }
                })
              }}
            />
            <label className="form-check-label" htmlFor={'all_category'}>
              {'Todas'}
            </label>
          </div>
          {Categorias &&
            Categorias.map((cate) => (
              <div key={cate._id} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="filter_category"
                  id={cate._id}
                  value={cate._id}
                  onChange={(e) => {
                    console.log(e.target.value)
                    setDataFilter((status) => {
                      return { ...status, categoy: e.target.value }
                    })
                  }}
                />
                <label className="form-check-label" htmlFor={cate._id}>
                  {cate.name}
                </label>
              </div>
            ))}

          <p className="m-0 mb-2">Filtra por Genero</p>
          <div>
            <div key={'all'} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id={'all'}
                onChange={(e) => {
                  setDataFilter((sta) => {
                    return { ...sta, gender: null }
                  })
                }}
                value="all"
              />
              <label className="form-check-label" htmlFor={'all'}>
                Todas
              </label>
            </div>
            {['men', 'women', 'kid'].map((gen) => (
              <div key={gen} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id={gen}
                  value={gen}
                  onChange={(e) => {
                    setDataFilter((sta) => {
                      return { ...sta, gender: e.target.value }
                    })
                  }}
                />
                <label className="form-check-label" htmlFor={gen}>
                  {gen}
                </label>
              </div>
            ))}
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
      <div className="container" style={{ minHeight: '50vh' }}>
        <p>QUE RARO</p>
      </div>
      <div className="container" style={{ minHeight: '50vh' }}>
        <p>QUE RARO</p>
      </div>
    </>
  )
}
