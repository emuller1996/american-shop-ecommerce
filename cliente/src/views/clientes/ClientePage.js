import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { Button, Modal } from 'react-bootstrap'
import { useClientes } from '../../hooks/useClientes'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'

const ClientePage = () => {
  const [dataFilter, setdataFilter] = useState({
    perPage: 10,
    search: '',
    page: 1,
    draw: 1,
  })

  const { getAllClientes, data, getAllClientesPagination, dataP, loading } = useClientes()

  useEffect(() => {
    getAllClientes()
  }, [])

  useEffect(() => {
    getAllClientesPagination(dataFilter)
  }, [dataFilter])

  return (
    <div className="">
      <CContainer fluid>
        <div className="card card-body mt-3">
          <span className="d-block text-muted">Buscar clientes.</span>
          <div className="row g-3 align-items-end">
            <div className="col-md-12">
              <div className="w-100">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input
                    placeholder="Busca Cliente por nombre, correo y telefono."
                    type="text"
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
              { name: 'Nombre', selector: (row) => row?.name_client ?? '', width: '200px' },
              { name: 'Correo', selector: (row) => row?.email_client ?? '', width: '200px' },
              { name: 'Telefono', selector: (row) => row?.phone_client ?? '', width: '150px' },
              {
                name: 'N. Documento',
                selector: (row) =>
                  `${row?.type_document_client ?? ''} -${row?.number_document_client ?? ''}`,
                width: '150px',
              },
              {
                name: 'Fecha Registro',
                selector: (row) =>
                  `${new Date(row?.createdTime).toISOString().split('T')[0] ?? ''} ${new Date(row?.createdTime).toLocaleTimeString() ?? ''}`,
                width: '250px',
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
            noDataComponent={
              <div className="d-flex justify-content-center my-5">No hay productos.</div>
            }
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
      </CContainer>
    </div>
  )
}

export default ClientePage
