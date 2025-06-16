import type { Config } from '@/types/config/config'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import React from 'react'

import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { configAtom } from '@/utils/atoms/config'

import { DEFAULT_CONFIG } from '@/utils/constants/config'
import App from './app'
import { AppSidebar } from './app-sidebar'
import '@/assets/tailwind/theme.css'
import './style.css'

document.documentElement.classList.toggle(
  'dark',
  localStorage.theme === 'dark'
  || (!('theme' in localStorage)
    && window.matchMedia('(prefers-color-scheme: dark)').matches),
)

function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: [[typeof configAtom, Config]]
  children: React.ReactNode
}) {
  useHydrateAtoms(initialValues)
  return children
}

async function initApp() {
  const root = document.getElementById('root')!
  root.className = 'antialiased bg-background'

  const config = await storage.getItem<Config>('local:config')

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <JotaiProvider>
        <HydrateAtoms initialValues={[[configAtom, config ?? DEFAULT_CONFIG]]}>
          <HashRouter>
            <SidebarProvider>
              <AppSidebar />
              <App />
            </SidebarProvider>
          </HashRouter>
        </HydrateAtoms>
      </JotaiProvider>
    </React.StrictMode>,
  )
}

initApp()
