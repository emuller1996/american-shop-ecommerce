/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react'
import { useLocalStorage } from '../../../../hooks/useLocalStorage'
import AuthContext from '../../../../context/AuthContext'
import { ViewDollar } from '../../../../utils'
import { useProductos } from '../../../../hooks/useProductos'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import './CartComponent.css'

export default function CartComponent() {
  const [cartEcommerceAmerican, setCartEcommerceAmerican] = useLocalStorage(
    'cartEcommerceAmerican',
    [],
  )
  const { client, cartEcommerceAmericanState, setCartEcommerceAmericanState } =
    useContext(AuthContext)

  const { validateProductoCart } = useProductos()

  const [Data, setData] = useState(null)
  const [isLoading, setisLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    getAllProductCart()
  }, [])

  const getAllProductCart = async () => {
    try {
      setisLoading(true)
      const rest = cartEcommerceAmericanState.map(async (pro) => {
        try {
          const resss = await validateProductoCart(pro._id, pro)
          return { ...resss.data.resutl, cantidad: pro.cantidad }
        } catch (error) {
          setCartEcommerceAmericanState(
            cartEcommerceAmericanState.filter((c) => c._id !== pro?._id),
          )
          setCartEcommerceAmerican(cartEcommerceAmericanState.filter((c) => c._id !== pro?._id))
          toast.error(`Se Borro un producto de tu carrito por que  no esta disponible.`)
          return null
        }
      })
      console.log(rest)
      const res2 = await Promise.all(rest)
      console.log(res2)

      console.log(res2.filter((c) => c !== null).map((c) => c))
      setData(res2.filter((c) => c !== null).map((c) => c))
    } catch (error) {
      console.log(error)
    } finally {
      setisLoading(false)
    }
  }

  return (
    <div className="mt-5">
      <div className="card card-body position-relative card-cart">
        <button onClick={() => navigate(-1)} className='btn  position-absolute start-0"' style={{zIndex:10, top:"10px"}}>
          <i className="fa-solid fa-chevron-left me-2"></i>Atras
        </button>
        <h5 className="text-center mb-0">
          <i className="fa-solid fa-cart-shopping fa-xl me-2"></i>Mi Carrito
        </h5>
      </div>
      <div className="table-responsive mt-5">
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Unidades</th>
              <th scope="col">Tallta</th>
              <th scope="col">Precio U.</th>
              <th scope="col">Total U.</th>

              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>
                  <div className="d-flex justify-content-center my-4">
                    <div className="spinner-border" role="status" style={{ color: '#db5b5b' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {Data &&
              Data.map((st) => (
                <tr key={st?._id} className="">
                  <td width={'450px'} scope="row">
                    <img
                      className="img-fluid me-3"
                      style={{ width: '60px', height: '60px', borderRadius: 50 }}
                      src={st?.image?.image}
                      alt=""
                    />
                    <span className="text-nowrap">{st?.product?.name}</span>
                  </td>
                  <td>{st?.cantidad}</td>
                  <td>{st?.size}</td>
                  <td>{ViewDollar(st?.product?.price)}</td>
                  <td>{ViewDollar(st?.product?.price * st?.cantidad)}</td>
                  <td>
                    <button
                      onClick={() => {
                        console.log(cartEcommerceAmericanState.filter((c) => c._id !== st?._id))

                        setCartEcommerceAmericanState(
                          cartEcommerceAmericanState.filter((c) => c._id !== st?._id),
                        )
                        setCartEcommerceAmerican(
                          cartEcommerceAmericanState.filter((c) => c._id !== st?._id),
                        )
                        setData(Data.filter((c) => c._id !== st?._id))
                        toast.success(`Se Borro el producto de tu carrito.`)
                      }}
                      type="button"
                      className="btn btn-sm btn-danger text-white"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}

            {Data && Array.isArray(Data) && Data.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <p className="text-center text-muted mt-4">NO HAY PRODUCTO EN EL CARRITO</p>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={4} align="right">
                <span className="fw-bold fs-5">Total</span>
              </td>
              <td colSpan={1}>
                <span className=" fs-5">
                  {Data &&
                    ViewDollar(
                      Data.reduce(
                        (acumulador, actual) => acumulador + actual.product.price * actual.cantidad,
                        0,
                      ),
                    )}
                </span>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
        {/* <p className="text-end me-5">
          Total{' '}
          {ViewDollar(
            cartEcommerceAmericanState.reduce(
              (acumulador, actual) => acumulador + actual.price_producto,
              0,
            ),
          )}
        </p> */}
      </div>
      <div className="mt-3 mb-2 text-center">
        {Data && Array.isArray(Data) && Data.length !== 0 && (
          <Link to={`/eco/confirmar-compra`}>
            <button disabled={client ? false : true} className="button-ecomerce">
              <i className="fa-solid fa-money-bill me-3"></i> Ir a Pagar
            </button>
          </Link>
        )}
        {/*    <button disabled={client ? false : true} className="button-ecomerce"></button> */}

        <p className="mt-5 text-muted">
          En <b> AMERICANSHOP</b>, nos complace informarte que ofrecemos servicios de envío a nivel
          nacional. Sea cual sea tu ubicación dentro del país, ¡podemos enviarte nuestros productos
          directamente a tu puerta!
        </p>
        <p className=" text-muted">
          Si tienes alguna pregunta adicional sobre nuestros servicios de envío o necesitas
          asistencia con tu pedido, no dudes en contactarnos. Estamos aquí para ayudarte.
        </p>
      </div>
    </div>
  )
}
