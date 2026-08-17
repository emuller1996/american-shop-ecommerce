/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { Button, Modal } from 'react-bootstrap'
import { useLogs } from '../../hooks/useLogs'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'

function decodeField(value) {
  if (!value) return null
  try {
    return JSON.parse(atob(value)) // base64 -> JSON
  } catch {
    try {
      return JSON.parse(value) // fallback: entradas viejas sin base64 (crearLogsElastic manual)
    } catch {
      return value // último recurso: string crudo
    }
  }
}

function nombreUsuario(usuario) {
  if (!usuario) return 'Anónimo'
  return usuario._id ?? usuario.name_client ?? usuario.name ?? usuario.email_client ?? 'Anónimo'
}

export default function LogsPage() {
  const [dataFilter, setdataFilter] = useState({
    perPage: 10,
    search: '',
    page: 1,
  })
  const [show, setShow] = useState(false)
  const [LogSelected, setLogSelected] = useState(undefined)

  const { getLogsPagination, dataP, loading } = useLogs()

  useEffect(() => {
    getLogsPagination(dataFilter)
  }, [dataFilter])

  return (
    <div className="">
      <CContainer fluid>
        <div className="card card-body mt-3">
          <span className="d-block text-muted">Buscar logs por endpoint, ip o descripción.</span>
          <div className="row g-3 align-items-end">
            <div className="col-md-12">
              <div className="w-100">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input
                    placeholder="Busca por endpoint, ip o descripción."
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
              {
                name: 'Acciones',
                width: '100px',
                cell: (row) => {
                  return (
                    <button
                      type="button"
                      className="btn-sm btn btn-info text-white"
                      onClick={() => {
                        setLogSelected(row)
                        setShow(true)
                      }}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  )
                },
              },
              {
                name: 'Fecha',
                selector: (row) => (row?.createdTime ? new Date(row.createdTime).toLocaleString() : ''),
                width: '200px',
              },
              { name: 'Método', selector: (row) => row?.method ?? '', width: '100px' },
              { name: 'Endpoint', selector: (row) => row?.endpoint ?? '', width: '250px' },
              { name: 'IP', selector: (row) => row?.ip ?? '', width: '150px' },
              { name: 'Usuario', selector: (row) => nombreUsuario(row?.usuario), width: '200px' },
              { name: 'Descripción', selector: (row) => row?.description ?? '' },
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
              <div className="d-flex justify-content-center my-5">No hay logs.</div>
            }
            onChangeRowsPerPage={(perPage) => {
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

      <Modal centered size="xl" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {LogSelected && (
            <>
              <div className="card card-body mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Fecha</strong>
                  <span>
                    {LogSelected?.createdTime
                      ? new Date(LogSelected.createdTime).toLocaleString()
                      : ''}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Método</strong>
                  <span>{LogSelected?.method ?? ''}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Endpoint</strong>
                  <span>{LogSelected?.endpoint ?? ''}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>IP</strong>
                  <span>{LogSelected?.ip ?? ''}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Usuario</strong>
                  <span>{nombreUsuario(LogSelected?.usuario)}</span>
                </div>
                {LogSelected?.description && (
                  <div className="d-flex justify-content-between">
                    <strong>Descripción</strong>
                    <span>{LogSelected.description}</span>
                  </div>
                )}
              </div>

              <p className="fw-bold mb-1">Headers</p>
              <pre className="bg-light p-3 rounded" style={{ maxHeight: 250, overflow: 'auto' }}>
                {JSON.stringify(decodeField(LogSelected?.header), null, 2)}
              </pre>

              <p className="fw-bold mb-1">Body</p>
              <pre className="bg-light p-3 rounded" style={{ maxHeight: 250, overflow: 'auto' }}>
                {JSON.stringify(decodeField(LogSelected?.body), null, 2)}
              </pre>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
