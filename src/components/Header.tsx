import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/habitos', label: 'Meus Hábitos' },
  { to: '/progresso', label: 'Progresso' },
]

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  const linkClass =
    'text-text-secondary hover:text-primary transition-colors duration-200 ease-out'
  const activeLinkClass = 'text-primary font-semibold'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-text-primary">
            Hábitos Diários
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(linkClass, isActive && activeLinkClass)
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b pb-4">
                  <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <Droplets className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold text-text-primary">
                      Hábitos Diários
                    </span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn('text-lg', linkClass, isActive && activeLinkClass)
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
