import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'
import { ConfigProvider } from './features/config/ConfigContext.tsx'
import { I18nProvider, loadMessages } from './i18n/I18nContext.tsx'
import { savedLocale } from './i18n/locales.ts'
import { applyTheme, savedTheme } from './theme/theme.ts'

// The colour scheme is applied before anything renders, so dark never flashes light.
applyTheme(savedTheme())

// Load the visitor's language before the first paint, so a French or Ukrainian
// visitor never sees a flash of English.
const locale = savedLocale()
void loadMessages(locale).then((messages) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nProvider initialLocale={locale} initialMessages={messages}>
        <BrowserRouter>
          <ConfigProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ConfigProvider>
        </BrowserRouter>
      </I18nProvider>
    </StrictMode>,
  )
})
