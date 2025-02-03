import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UsuariosPage = React.lazy(() => import('./views/usuarios/UsuariosPage'))
const ProductosPage = React.lazy(() => import('./views/productos/Productos'))
const CategoriasPage = React.lazy(() => import('./views/categorias/Categorias'))
const ImagesPage = React.lazy(() => import('./views/productos/ImagesPage/ImagesPage'))
const ClientePage = React.lazy(() => import('./views/clientes/ClientePage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/usuarios', name: 'Usuarios', element: UsuariosPage },
  { path: '/productos', name: 'Productos', element: ProductosPage },
  { path: '/categorias', name: 'Categorias', element: CategoriasPage },
  { path: '/clientes', name: 'Clientes', element: ClientePage },
  { path: '/productos/:idProduct/images', name: 'ImagesPage', element: ImagesPage },
]

export default routes
