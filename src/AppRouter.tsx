/**
 * AppRouter — Root router with ScrollToTop behaviour.
 *
 * ScrollToTop resets window.scrollY to 0 on every pathname change so that
 * navigating between pages always starts at the top. Uses behavior:'instant'
 * to avoid a visible scroll animation on route transitions.
 *
 * Add new routes here; each route maps to one page component.
 */
import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import App from './App'
import FaqsPage from './pages/FaqsPage'
import AllotjamentsPage from './pages/AllotjamentsPage'
import BungalowTradPage from './pages/BungalowTradPage'
import ServeisPage from './pages/ServeisPage'
import EntornPage from './pages/EntornPage'
import ContactePage from './pages/ContactePage'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/el-camping/faqs" element={<FaqsPage />} />
        <Route path="/allotjaments" element={<AllotjamentsPage />} />
        <Route path="/allotjaments/bungalow-tradicional" element={<BungalowTradPage />} />
        <Route path="/serveis" element={<ServeisPage />} />
        <Route path="/entorn" element={<EntornPage />} />
        <Route path="/contacte" element={<ContactePage />} />
      </Routes>
    </>
  )
}
