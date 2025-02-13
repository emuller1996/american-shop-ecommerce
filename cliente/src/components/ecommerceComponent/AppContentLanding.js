import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import HomeLanding from './pages/HomeLanding'
import ProductDetailPage from './pages/ProductDetailPage'

// routes config

const routes = [
  { path: '/', exact: true, name: 'Home', element: HomeLanding },
  { path: '/eco/:id/producto', exact: true, name: 'Home', element: ProductDetailPage },
]

const AppContentLanding = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<>404 PAGE</>} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContentLanding)
