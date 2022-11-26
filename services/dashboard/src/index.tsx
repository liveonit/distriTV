import * as React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { GlobalProvider } from '@app/context/GlobalContext'

import store from './store'
import '@app/locales/i18n'
import App from './App/App'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <Provider store={store}>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </Provider>,
)
