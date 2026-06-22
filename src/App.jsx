import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Layouts
import PortfolioLayout from './components/layout/PortfolioLayout'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import PengalamanPage from './pages/public/PengalamanPage'
import HimaPage from './pages/public/HimaPage'
import BemPage from './pages/public/BemPage'
import ProjectPage from './pages/public/ProjectPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'

// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import EditProfil from './pages/admin/EditProfil'
import EditPendidikan from './pages/admin/EditPendidikan'
import EditPengalaman from './pages/admin/EditPengalaman'
import EditProject from './pages/admin/EditProject'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Guest Route Component (redirect to admin if already logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PortfolioLayout><HomePage /></PortfolioLayout>} />
        <Route path="/pengalaman" element={<PortfolioLayout><PengalamanPage /></PortfolioLayout>} />
        <Route path="/pengalaman/hima" element={<PortfolioLayout><HimaPage /></PortfolioLayout>} />
        <Route path="/pengalaman/bem" element={<PortfolioLayout><BemPage /></PortfolioLayout>} />
        <Route path="/project" element={<PortfolioLayout><ProjectPage /></PortfolioLayout>} />

        {/* Auth Routes */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/edit-profil" element={<ProtectedRoute><AdminLayout><EditProfil /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/edit-pendidikan" element={<ProtectedRoute><AdminLayout><EditPendidikan /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/edit-pengalaman" element={<ProtectedRoute><AdminLayout><EditPengalaman /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/edit-project" element={<ProtectedRoute><AdminLayout><EditProject /></AdminLayout></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
