import { Link } from 'react-router-dom'

const Header = ({ profile }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-white hover:text-emerald-400 transition-colors">
          {profile?.nama || 'Portfolio'}
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/#profil" className="text-sm text-gray-400 hover:text-white transition-colors">Profil</Link>
          <Link to="/#pendidikan" className="text-sm text-gray-400 hover:text-white transition-colors">Pendidikan</Link>
          <Link to="/#pengalaman" className="text-sm text-gray-400 hover:text-white transition-colors">Pengalaman</Link>
          <Link to="/#project" className="text-sm text-gray-400 hover:text-white transition-colors">Project</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
