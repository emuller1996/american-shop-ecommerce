import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { Button, Form, Modal, Tooltip } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import {
  genderOptions,
  paginationComponentOptions,
  stylesSelect,
  themeSelect,
} from '../../utils/optionsConfig'
import FormProducto from './components/FormProducto'
import { useProductos } from '../../hooks/useProductos'
import { ViewDollar } from '../../utils'
import { Link } from 'react-router-dom'
import FormImportProductos from './components/FormImportProductos'
import Select from 'react-select'
import { Chip } from '@mui/material'
import ImagesPage from './ImagesPage/ImagesPage'

const ProductosPage = () => {
  const [show, setShow] = useState(false)
  const [showSize, setShowSize] = useState(false)

  const [showImport, setShowImport] = useState(false)
  const [Draw, setDraw] = useState(1)
  const [dataFilter, setdataFilter] = useState({
    perPage: 10,
    search: '',
    page: 1,
    draw: 1,
  })

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const {
    getAllProductos,
    data: ListProductos,
    getAllProductosPagination,
    dataP,
    loading,
  } = useProductos()
  const [ProductoSelecionado, setProductoSelecionado] = useState(null)

  useEffect(() => {
    getAllProductosPagination(dataFilter)
  }, [dataFilter])
  return (
    <div className="container-fluid">
      <div>
        <div className="gap-4 d-flex justify-content-start">
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
          <Button
            variant="success text-white"
            className="text-nowrap"
            onClick={() => {
              setShowImport(true)
            }}
          >
            <i className="fa-solid fa-file-excel me-2"></i>
            Importar Productos
          </Button>
        </div>
        <div className="card card-body mt-3">
          <span className="d-block text-muted">Filtros Avanzados</span>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <div>
                <Form.Label htmlFor="gender">Genero</Form.Label>
                <Select
                  name={'gender'}
                  placeholder=""
                  onChange={(e) => {
                    console.log(e)
                    setdataFilter((status) => {
                      return { ...status, gender: e?.value ?? '' }
                    })
                  }}
                  styles={stylesSelect}
                  theme={themeSelect}
                  options={genderOptions}
                  isClearable
                />
              </div>
            </div>
            <div className="col-md-12">
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
                    onChange={(e) => {
                      setdataFilter((status) => {
                        return { ...status, search: e.target.value }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
          <DataTable
            className="MyDataTableEvent"
            striped
            columns={[
              {
                name: 'Acciones',
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
                      <button
                        to={`${row._id}/images`}
                        onClick={() => {
                          setProductoSelecionado(row)
                          setShowSize(true)
                        }}
                        title="Editar Producto."
                        className="btn btn-info btn-sm me-2"
                      >
                        <i className="text-white fa-regular fa-images"></i>
                      </button>
                      <Link
                        to={`${row._id}/gestion-tallas`}
                        onClick={() => {
                          setProductoSelecionado(row)
                          handleShow()
                        }}
                        title="Gestion de Tallas del Producto."
                        className="btn btn-secondary btn-sm"
                      >
                        <i className="fa-solid fa-tags"></i>
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
                name: 'Estado',
                selector: (row) => (row?.published ? 'Publicado' : 'No Publicado'),
                width: '150px',
                cell: (row) => {
                  return (
                    <>
                      <Chip
                        style={{
                          backgroundColor: row?.published ? '#23b866' : '#F78181',
                          color: 'white',
                        }}
                        label={row?.published ? 'Publicado' : 'No Publicado'}
                        variant="outlined"
                      />
                    </>
                  )
                },
              },

              {
                name: 'Categoria',
                selector: (row) => row?.categoria?.name ?? '',
                width: '150px',
              },
              { name: 'Marca', selector: (row) => row?.brand ?? '', width: '100px' },
              { name: 'Genero', selector: (row) => row?.gender ?? '', width: '100px' },
              {
                name: 'Fecha de Creacion.',
                selector: (row) =>
                  `${new Date(row?.createdTime).toLocaleDateString() ?? ''} ${new Date(row?.createdTime).toLocaleTimeString() ?? ''}`,
                width: '160px',
              },
              {
                name: 'Fecha de Actua',
                selector: (row) =>
                  `${new Date(row?.updatedTime).toLocaleDateString() ?? ''} ${new Date(row?.updatedTime).toLocaleTimeString() ?? ''}`,
                width: '160px',
              },

              { name: '', selector: (row) => row?.city ?? '' },
            ]}
            data={dataP?.data}
            pagination
            paginationServer
            progressPending={loading}
            progressComponent={
              <div className="d-flex justify-content-center my-5">
                <div
                  className="spinner-border text-primary"
                  style={{ width: '3em', height: '3em' }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            }
            paginationTotalRows={dataP?.total}
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent="No hay datos para mostrar"
            onChangeRowsPerPage={(perPage, page) => {
              console.log(perPage, page)
              setdataFilter((status) => {
                return { ...status, perPage }
              })
            }}
            onChangePage={(page) => {
              setdataFilter((status) => {
                return { ...status, page }
              })
            }}
          />
        </div>
        <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
          <Modal.Body>
            <FormProducto
              producto={ProductoSelecionado}
              getAllProduct={() => {
                setdataFilter((sta) => {
                  return { ...sta, draw: ++sta.draw }
                })
              }}
              onHide={handleClose}
            />
          </Modal.Body>
        </Modal>
        <Modal
          centered
          show={showImport}
          onHide={() => {
            setShowImport(false)
          }}
        >
          <Modal.Body>
            <FormImportProductos
              getAllProduct={() => {
                setDraw((status) => ++status)
              }}
            />
          </Modal.Body>
        </Modal>
        <Modal size="lg" centered show={showSize} onHide={() => setShowSize(false)}>
          <Modal.Body>
            <ImagesPage
              idProduct={ProductoSelecionado?._id}
              getAllProduct={() => {
                setdataFilter((sta) => {
                  return { ...sta, draw: ++sta.draw }
                })
              }}
              onHide={handleClose}
            />
            <div className="text-center">
              <Button
                variant="danger"
                className="text-nowrap text-white"
                onClick={() => {
                  setProductoSelecionado(null)
                  setShowSize(false)
                }}
              >
                Cerrar
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default ProductosPage
