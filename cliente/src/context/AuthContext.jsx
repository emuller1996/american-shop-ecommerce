/* eslint-disable prettier/prettier */

import React from 'react'
import { createContext, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { isTokenExpired } from '../utils/tokenUtils'

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  }

  const [tokenAccess, setTokenAccess] = useLocalStorage('tokenAccessAmericanShop', null)
  const [tokenAccessCliente, setTokenAccessCliente] = useLocalStorage(
    'tokenAccessClienteAmericanShop',
    null,
  )
  const [Token, setToken] = useState(tokenAccess ? tokenAccess : null)
  const [TokenClient, setTokenClient] = useState(tokenAccessCliente ? tokenAccessCliente : null)

  const [user, setUser] = useState(tokenAccess ? jwtDecode(tokenAccess) : null)
  const [client, setClient] = useState(() => {
    if (!tokenAccessCliente || isTokenExpired(tokenAccessCliente)) return null
    return jwtDecode(tokenAccessCliente)
  })

  const [cartEcommerceAmerican, setCartEcommerceAmerican] = useLocalStorage(
    'cartEcommerceAmerican',
    [],
  )

  const [cartEcommerceAmericanState, setCartEcommerceAmericanState] = useState(
    cartEcommerceAmerican ? cartEcommerceAmerican : null,
  )

  const cerrarSessionAdmin = () => {
    setTokenAccess(null)
    setToken(null)
    setClient(null)
    localStorage.removeItem("tokenAccessAmericanShop")
  }

  const cerrarSessionCliente = () => {
    setTokenClient(null)
    setClient(null)
    setTokenAccessCliente(null)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenAccessCliente && isTokenExpired(tokenAccessCliente)) {
        cerrarSessionCliente()
      }
    }, 60000)
    return () => clearInterval(interval)
  }, [tokenAccessCliente])

  let contextData = {
    user,
    setUser,
    setToken,
    Token,
    setTokenAccessCliente,
    tokenAccessCliente,
    setTokenClient,
    TokenClient,
    setClient,
    client,
    cartEcommerceAmericanState,
    setCartEcommerceAmericanState,
    cerrarSessionAdmin,
    cerrarSessionCliente,
  }

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
}
