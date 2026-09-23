/* eslint-disable prettier/prettier */

import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { Chip } from '@mui/material'
import toast from 'react-hot-toast'
import FormPublicacion from './components/FormPublicacion'
import { usePublicaciones } from '../../hooks/usePublicaciones'
import { paginationComponentOptions } from '../../utils/optionsConfig'

const PublicacionesPage = () => {
  const [show, setShow] = useState(false)
  const [PublicacionSeleccionada, setPublicacionSeleccionada] = useState(null)
  const [draw, setDraw] = useState(1)
  const [deletingId, setDeletingId] = useState(null)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const {
    getAllPublicaciones,
    data: ListPublicaciones,
    loading,
    deletePublicacion,
    abortController,
  } = usePublicaciones()

  useEffect(() => {
    getAllPublicaciones()
    return () => {
      abortController.abort()
    }
  }, [draw])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta publicación? Esta acción es permanente.')) return
    try {
      setDeletingId(id)
      await deletePublicacion(id)
      toast.success('Publicación eliminada.')
      setDraw((status) => ++status)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message ?? 'No se pudo eliminar la publicación.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container-fluid">
      <Button
        variant="primary"
        onClick={() => {
          handleShow()
          setPublicacionSeleccionada(null)
        }}
      >
        Crear Publicación
      </Button>

      <div className="rounded overflow-hidden border border-ligth shadow-sm mt-3">
        <DataTable
          className="MyDataTableEvent"
          striped
          columns={[
            {
              name: 'Imagen',
              width: '100px',
              cell: (row) => (
                <img
                  src={row?.image}
                  alt={row?.title ?? 'Publicación'}
                  style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ),
            },
            { name: 'Título', selector: (row) => row?.title ?? '', width: '220px' },
            {
              name: 'Posición',
              cell: (row) => (
                <span className="badge bg-secondary text-uppercase">
                  {row?.posicion_imagen === 'izquierda' ? 'Imagen Izquierda' : 'Imagen Derecha'}
                </span>
              ),
            },
            {
              name: 'Publicado',
              cell: (row) => (
                <Chip
                  style={{
                    backgroundColor: row?.published ? '#218340' : '#a92525',
                    color: 'white',
                  }}
                  label={row?.published ? 'Publicado' : 'No Publicado'}
                  variant="outlined"
                />
              ),
            },
            { name: 'Orden', selector: (row) => row?.orden ?? '', width: '90px' },
            {
              name: 'Acciones',
              cell: (row) => (
                <>
                  <button
                    onClick={() => {
                      setPublicacionSeleccionada(row)
                      handleShow()
                    }}
                    title="Editar Publicación."
                    className="btn btn-primary btn-sm me-2"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(row._id)}
                    disabled={deletingId === row._id}
                    title="Eliminar Publicación."
                    className="btn btn-danger btn-sm text-white"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </>
              ),
            },
          ]}
          data={ListPublicaciones ?? []}
          pagination
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
          paginationComponentOptions={paginationComponentOptions}
          noDataComponent="No hay publicaciones para mostrar"
        />
      </div>

      <Modal backdrop={'static'} size="lg" centered show={show} onHide={handleClose}>
        <Modal.Body>
          <FormPublicacion
            publicacion={PublicacionSeleccionada}
            onHide={() => {
              handleClose()
              setDraw((status) => ++status)
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PublicacionesPage
