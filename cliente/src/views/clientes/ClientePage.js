import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react'
import { Button, Modal } from 'react-bootstrap'
import { useClientes } from '../../hooks/useClientes'
import DataTable from 'react-data-table-component'
import { paginationComponentOptions } from '../../utils/optionsConfig'

const ClientePage = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [CategoriaSelec, setCategoriaSelec] = useState(null)

  const { getAllClientes, data } = useClientes()

  useEffect(() => {
    getAllClientes()
  }, [])

  return (
    <div className="">
      <CContainer fluid>
        <Button variant="primary">EXPORTAR CLIENTS</Button>
        <div className="row g-3 my-3"></div>
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
            data={data ?? []}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            noDataComponent="No hay datos para mostrar"
          />
        </div>
        <Modal backdrop={'static'} size="md" centered show={show} onHide={handleClose}>
          <Modal.Body></Modal.Body>
        </Modal>
      </CContainer>
    </div>
  )
}

export default ClientePage
