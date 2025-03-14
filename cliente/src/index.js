import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import es from 'javascript-time-ago/locale/es'

TimeAgo.addDefaultLocale(es)
TimeAgo.addLocale(es)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
