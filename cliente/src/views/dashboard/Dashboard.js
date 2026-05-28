import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Dashboard = () => {
  const [metricsData, setMetricsData] = useState([])
  const [totals, setTotals] = useState({ totalOrders: 0, totalRevenue: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/metrics/orders-stats')
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.stats || response.data.data || []

        setMetricsData(data)
        const totalOrders = data.reduce((sum, item) => sum + (item.count || 0), 0)
        const totalRevenue = data.reduce((sum, item) => sum + (item.total || 0), 0)
        setTotals({ totalOrders, totalRevenue })
      } catch (error) {
        console.error('Error fetching metrics:', error)
        setMetricsData([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  return (
    <div className="p-4">
      <CRow>
        {/* Total Pedidos Card */}
        <CCol xs={12} md={6} lg={4}>
          <CCard className="mb-4 shadow-sm">
            <CCardBody className="d-flex align-items-center">
              <div className="rounded-circle bg-info p-3 me-3 text-white"></div>
              <div>
                <h6 className="text-muted mb-0">Total Pedidos (14d)</h6>
                <h4 className="mb-0 fw-bold">{isLoading ? '...' : totals.totalOrders}</h4>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Ingresos Card */}
        <CCol xs={12} md={6} lg={4}>
          <CCard className="mb-4 shadow-sm">
            <CCardBody className="d-flex align-items-center">
              <div className="rounded-circle bg-success p-3 me-3 text-white"></div>
              <div>
                <h6 className="text-muted mb-0">Total Ingresos (14d)</h6>
                <h4 className="mb-0 fw-bold">
                  {isLoading ? '...' : `$${totals.totalRevenue.toLocaleString()}`}
                </h4>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="d-flex align-items-center">
              <strong>Métricas de Ventas</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading ? (
                <div className="text-center py-5">Cargando gráficas...</div>
              ) : metricsData.length === 0 ? (
                <div className="text-center py-5">No hay datos disponibles para mostrar.</div>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metricsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={getStyle('--cui-border-color-translucent')}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: getStyle('--cui-body-color') }}
                        axisLine={{ stroke: getStyle('--cui-border-color-translucent') }}
                      />
                      <YAxis
                        tick={{ fill: getStyle('--cui-body-color') }}
                        axisLine={{ stroke: getStyle('--cui-border-color-translucent') }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Pedidos"
                        stroke={getStyle('--cui-info')}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Ingresos ($)"
                        stroke={getStyle('--cui-success')}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard
