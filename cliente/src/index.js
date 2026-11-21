import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import 'core-js'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import App from './App'
//import store from './store'

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import es from 'javascript-time-ago/locale/es'
import { store } from './redux/store'

TimeAgo.addDefaultLocale(es)
TimeAgo.addLocale(es)

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Sofia Sans"',
      'Roboto', // opcional: fallback a Roboto (la fuente por defecto de MUI)
      'Arial',
      'sans-serif',
    ].join(','),
    // También puedes configurar variantes específicas
    h1: {
      fontFamily: '"Otra Fuente", sans-serif',
    },
  },
})

// Compatibilidad con enlaces antiguos de HashRouter (ej. /#/eco/reset-password/<token>):
// se convierten a la ruta equivalente de BrowserRouter antes de montar la app.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </HelmetProvider>,
)
