import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from './components/theme-provider'
import App from './App'
import { store } from './store'
import i18n from './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="system" storageKey="fashion-hub-theme">
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>,
)
