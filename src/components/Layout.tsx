import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NotificationManager } from './NotificationManager'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      <Header />
      <NotificationManager />
      <main className="flex-grow container py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
