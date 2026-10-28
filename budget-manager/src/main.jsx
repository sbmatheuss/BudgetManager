import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense
      fallback={<p className="px-4 py-10 text-center text-sm text-lapis">Carregando...</p>}
    >
      <App />
    </Suspense>
  </StrictMode>,
)
