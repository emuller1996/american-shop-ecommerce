/* eslint-disable prettier/prettier */
import axios from 'axios'


export const getConsultasPaginationServices = async (token, ...params) => {
  const searchs = new URLSearchParams()

  Object.entries(params[0]).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchs.append(key, value)
    }
  })

  return await axios.get(`/consultas/pagination/?${searchs.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
