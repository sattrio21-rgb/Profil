import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const Dashboard = () => {
  const [stats, setStats] = useState({
    profileComplete: false,
    pengalamanCount: 0,
    projectCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nama, deskripsi, foto_url')
        .limit(1)
        .single()

      const { count: pengalamanCount } = await supabase
        .from('pengalamans')
        .select('*', { count: 'exact', head: true })

      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })

      setStats({
        profileComplete: profile?.nama && profile?.deskripsi && profile?.foto_url ? true : false,
        pengalamanCount: pengalamanCount || 0,
        projectCount: projectCount || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.profileComplete ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <svg className={`w-6 h-6 ${stats.profileComplete ? 'text-emerald-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Profil</p>
              <p className={`text-lg font-semibold ${stats.profileComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stats.profileComplete ? 'Lengkap' : 'Belum Diisi'}
              </p>
            </div>
          </div>
        </div>

        {/* Pengalaman Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pengalaman</p>
              <p className="text-lg font-semibold text-gray-900">{stats.pengalamanCount}</p>
            </div>
          </div>
        </div>

        {/* Project Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Project</p>
              <p className="text-lg font-semibold text-gray-900">{stats.projectCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
