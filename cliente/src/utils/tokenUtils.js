/* eslint-disable prettier/prettier */
import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const decoded = jwtDecode(token)
    if (!decoded?.exp) return false
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
