/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import HabitosPage from './pages/Habitos'
import ProgressoPage from './pages/Progresso'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import { HabitProvider } from './contexts/HabitContext'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <HabitProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/habitos" element={<HabitosPage />} />
            <Route path="/progresso" element={<ProgressoPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HabitProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
