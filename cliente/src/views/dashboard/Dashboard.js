import React, { useEffect, useState } from 'react'
import { useMetrics } from '../../hooks/useMetrics'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { ViewDollar } from '../../utils'

const Dashboard = () => {
  const {
    data: metricsData,
    statusData,
    loading: isLoading,
    getOrdersStats,
    getStatusStats,
  } = useMetrics()

  useEffect(() => {
    getOrdersStats()
    getStatusStats()
  }, [])

  console.log(statusData?.ordersStatus);

  return (
    <div className="p-4">
      <CRow>
        {/* Total Pedidos Card */}
        <CCol xs={12} md={6} lg={4}>
          <CCard className="mb-4 shadow-sm">
            <CCardBody className="d-flex align-items-center">
              <div
                className="rounded-circle bg-info p-3 me-3 text-white d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px' }}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0">Total Pedidos</h6>
                <small className="text-muted">Ultimos 14 Dias</small>
                <h4 className="mb-0 fw-bold">
                  {isLoading ? '...' : metricsData?.totals?.totalOrders}
                </h4>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Total Ingresos Card */}
        <CCol xs={12} md={6} lg={4}>
          <CCard className="mb-4 shadow-sm">
            <CCardBody className="d-flex align-items-center">
              <div
                className="rounded-circle bg-success p-3 me-3 text-white d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px' }}
              >
                <i className="fa-solid fa-dollar-sign"></i>
              </div>
              <div>
                <h6 className="text-dark mb-0">Total Ingresos</h6>
                <small className="text-muted">Ultimos 14 Dias</small>
                <h4 className="mb-0 fw-bold">
                  {isLoading ? '...' : `${ViewDollar(metricsData?.totals?.totalRevenue)}`}
                </h4>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Gráfica de Cantidad de Pedidos */}
        <CCol xs={12} lg={6}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="d-flex align-items-center">
              <strong>Cantidad de Pedidos</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading ? (
                <div className="text-center py-5">Cargando...</div>
              ) : !metricsData || !metricsData.dailyStats || metricsData.dailyStats.length === 0 ? (
                <div className="text-center py-5">No hay datos disponibles.</div>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metricsData.dailyStats}
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
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Gráfica de Ingresos Totales */}
        <CCol xs={12} lg={6}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="d-flex align-items-center">
              <strong>Ingresos Totales ($)</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading ? (
                <div className="text-center py-5">Cargando...</div>
              ) : !metricsData || !metricsData.dailyStats || metricsData.dailyStats.length === 0 ? (
                <div className="text-center py-5">No hay datos disponibles.</div>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metricsData.dailyStats}
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
      <CRow>
        {/* Donut Pedidos */}
        <CCol xs={12} lg={6}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="d-flex align-items-center">
              <strong>Estado de Pedidos</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading && !statusData ? (
                <div className="text-center py-5">Cargando...</div>
              ) : !statusData ||
                !statusData.ordersStatus ||
                statusData.ordersStatus.length === 0 ? (
                <div className="text-center py-5">No hay datos disponibles.</div>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData.ordersStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.ordersStatus.map((entry, index) => (
                          <Cell
                            key={`cell-order-${index}`}
                            fill={getStyle(`--cui-info`)}
                            style={{ opacity: 1 - index * 0.2 }}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Donut Consultas */}
        <CCol xs={12} lg={6}>
          <CCard className="mb-4 shadow-sm">
            <CCardHeader className="d-flex align-items-center">
              <strong>Estado de Consultas</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading && !statusData ? (
                <div className="text-center py-5">Cargando...</div>
              ) : !statusData ||
                !statusData.consultasStatus ||
                statusData.consultasStatus.length === 0 ? (
                <div className="text-center py-5">No hay datos disponibles.</div>
              ) : (
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData.consultasStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.consultasStatus.map((entry, index) => (
                          <Cell
                            key={`cell-query-${index}`}
                            fill={getStyle(`--cui-success`)}
                            style={{ opacity: 1 - index * 0.2 }}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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
