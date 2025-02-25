/* eslint-disable prettier/prettier */
import React, { useContext } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import AuthContext from '../../context/AuthContext'
import { ViewDollar } from '../../utils'

export default function CartComponent() {
  const [cartEcommerceAmerican, setCartEcommerceAmerican] = useLocalStorage(
    'cartEcommerceAmerican',
    [],
  )
  const {
    client,
    cartEcommerceAmericanState,
    setCartEcommerceAmericanState,
  } = useContext(AuthContext)
  return (
    <>
      <p>Mi Carrito</p>
      <div className="table-responsive">
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Unidades</th>
              <th scope="col">Tallta</th>
              <th scope="col">Precio</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {cartEcommerceAmericanState.map((st) => (
              <tr key={st._id} className="">
                <td scope="row">{st.name_producto}</td>
                <td>{st.cantidad}</td>
                <td>{st.size}</td>
                <td>{ViewDollar(st.price_producto)}</td>
                <td>
                  <button
                    onClick={() => {
                      console.log(cartEcommerceAmericanState.filter((c) => c._id !== st._id))
                      setCartEcommerceAmericanState(
                        cartEcommerceAmericanState.filter((c) => c._id !== st._id),
                      )
                      setCartEcommerceAmerican(
                        cartEcommerceAmericanState.filter((c) => c._id !== st._id),
                      )
                    }}
                    type="button"
                    className="btn btn-sm btn-danger text-white"
                  >
                    <i className="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Total{' '}
          {ViewDollar(
            cartEcommerceAmericanState.reduce(
              (acumulador, actual) => acumulador + actual.price_producto,
              0,
            ),
          )}
        </p>
        <div className="mt-3 mb-2 text-center">
          <button disabled={client ? false : true} className="button-ecomerce">
            <i className="fa-solid fa-money-bill me-3"></i> Ir a Pagar
          </button>
        </div>
      </div>
    </>
  )
}
