import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { Button, Modal, Tooltip } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'
import FormProducto from './components/FormProducto'
import { useProductos } from '../../hooks/useProductos'
import { ViewDollar } from '../../utils'
import { Link } from 'react-router-dom'

const ProductosPage = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { getAllProductos, data: ListProductos } = useProductos()
  const [ProductoSelecionado, setProductoSelecionado] = useState(null)

  useEffect(() => {
    getAllProductos()
  }, [])
  return (
    <div className="container-fluid">
      <div>
        <div className="gap-4 d-flex justify-content-center">
          <Button
            variant="primary"
            className="text-nowrap"
            onClick={() => {
              handleShow()
              setProductoSelecionado(null)
            }}
          >
            Crear Producto
          </Button>
          <div className="w-100">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                placeholder="Busque Producto por Nombre, Categoria y Marca"
                type="text"
                aria-label="First name"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          <DataTable
            className="MyDataTableEvent"
            striped
            columns={[
              {
                name: 'Id',
                cell: (row) => {
                  return (
                    <>
                      <button
                        onClick={() => {
                          setProductoSelecionado(row)
                          handleShow()
                        }}
                        title="Editar Producto."
                        className="btn btn-primary btn-sm me-2"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <Link
                        to={`${row._id}/images`}
                        onClick={() => {
                          setProductoSelecionado(row)
                          handleShow()
                        }}
                        title="Editar Producto."
                        className="btn btn-info btn-sm"
                      >
                        <i className="text-white fa-regular fa-images"></i>
                      </Link>
                    </>
                  )
                },
              },
              //{ name: 'Id', selector: (row) => row._id, width: '100px' },
              { name: 'Nombre', selector: (row) => row?.name ?? '', width: '250px' },
              {
                name: 'Precio',
                selector: (row) => row?.price ?? '',
                format: (row) => ViewDollar(row?.price) ?? '',
                width: '150px',
              },
              { name: 'Costo', selector: (row) => ViewDollar(row?.cost) ?? '', width: '150px' },
              {
                name: 'Categoria',
                selector: (row) => row?.categoria?.name ?? '',
                width: '150px',
              },
              { name: 'Marca', selector: (row) => row?.brand ?? '', width: '100px' },
              { name: 'Genero', selector: (row) => row?.gender ?? '', width: '100px' },
              { name: '', selector: (row) => row?.city ?? '' },
            ]}
            data={ListProductos && ListProductos}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent="No hay datos para mostrar"
          />
        </div>
        <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
          <Modal.Body>
            <FormProducto
              producto={ProductoSelecionado}
              getAllProduct={getAllProductos}
              onHide={handleClose}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default ProductosPage
