import axios from 'axios'

export const getLogsSearchPaginationServices = async (token, ...params) => {
  const searchs = new URLSearchParams()

  Object.entries(params[0]).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchs.append(key, value)
    }
  })

  return await axios.get(`/logs/pagination/?${searchs.toString()}`, {
    headers: {
      'access-token': `${token}`,
    },
  })
}
