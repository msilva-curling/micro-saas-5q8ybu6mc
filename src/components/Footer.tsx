export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/40">
      <div className="container flex h-14 items-center justify-between text-sm text-text-secondary">
        <p>© {new Date().getFullYear()} Hábitos Diários</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            Sobre
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  )
}
