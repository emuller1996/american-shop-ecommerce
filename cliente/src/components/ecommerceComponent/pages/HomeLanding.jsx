/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react'
import CardProducto from '../../../views/landing/components/CardProducto'
import { useProductos } from '../../../hooks/useProductos'
import { useCategorias } from '../../../hooks/useCategorias'

export default function HomeLanding() {
  const { getAllProductos, data: Productos } = useProductos()
  const { getAllCategorias, data: Categorias } = useCategorias()

  useEffect(() => {
    getAllCategorias()
    getAllProductos()
  }, [])
  return (
    <>
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
    </>
  )
}
