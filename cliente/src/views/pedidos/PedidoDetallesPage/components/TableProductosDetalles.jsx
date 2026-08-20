/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalHeader,
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import { ViewDollar } from '../../../../utils'
import { useOrden } from '../../../../hooks/useOrden'
import { useParams } from 'react-router-dom'

TableProductosDetalles.propTypes = {
  products: PropTypes.array,
  refreshOrder: PropTypes.func,
}

export default function TableProductosDetalles({ products, refreshOrder }) {
  const [ProductPacking, setProductPacking] = useState({
    show: false,
    product: null,
  })

  const { idOrder } = useParams()
  const { packProductOfOrder } = useOrden()

  const onPacking = async () => {
    console.log('Mandar el Empaque  ', ProductPacking.product.stock_id)
    try {
      await packProductOfOrder(idOrder, {
        stock_id: ProductPacking.product.stock_id,
        product_id: ProductPacking.product.product_id,
      })
      await refreshOrder()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="table-responsive mt-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio U.</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Talla</th>
              <th scope="col">Precio Total.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((pro) => (
              <tr key={pro._id} className="">
                <td width={'450px'} scope="row">
                  <div>
                    <img
                      src={pro.image}
                      alt="IMG_PRODUCT"
                      style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                    />
                    <span className="ms-3">{pro.producto_data.name}</span>
                  </div>
                </td>
                <td>{ViewDollar(pro.price)}</td>
                <td>{pro.cantidad}</td>
                <td>{pro.stock_data.size}</td>
                <td>{ViewDollar(pro.price * pro.cantidad)}</td>
                <td>
                  <Badge className={`bg-${pro.status || 'warning'} warning`}>
                    {pro.status || 'Pendiente'}
                  </Badge>
                </td>
                <td>
                  {!pro.status && (
                    <Button
                      onClick={() => {
                        setProductPacking({ show: true, product: pro })
                      }}
                      title="Empacar"
                      size="sm"
                      variant="light"
                    >
                      <i className="fa-solid fa-boxes-packing"></i>{' '}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={ProductPacking.show} centered>
        <ModalHeader
          closeButton={true}
          onHide={() => {
            setProductPacking({ show: false, product: null })
          }}
        >
          Empacar Producto
        </ModalHeader>
        <ModalBody>
          <p> Seguro desea empacar este producto para despachar en la Orden de compra.</p>
          <div className="d-flex justify-content-between">
            <span>Producto </span>
            <span className="fw-semibold text-primary">
              {ProductPacking?.product?.producto_data?.name || ' '}{' '}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Talla </span>
            <span className="fw-semibold text-primary">
              {ProductPacking?.product?.stock_data?.size || ' '}{' '}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Cantida a Empacar </span>
            <span className="fw-semibold text-primary">
              {ProductPacking?.product?.cantidad || ' '}{' '}
            </span>
          </div>
          <div className="d-flex justify-content-between">
            <span>en Stock </span>
            <span className="fw-semibold text-primary">
              {ProductPacking?.product?.stock_data.stock || ' - '}{' '}
            </span>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setProductPacking({ show: false, product: null })
            }}
            variant="outline-danger"
          >
            Cancelar
          </Button>
          <Button onClick={onPacking}> Empacar</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
