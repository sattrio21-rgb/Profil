import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ScrollAnimate from '../../components/ui/ScrollAnimate'

const HomePage = () => {
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [pendidikans, setPendidikans] = useState([])
  const [pengalamans, setPengalamans] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single()

        // Fetch pendidikans
        const { data: pendidikanData } = await supabase
          .from('pendidikans')
          .select('*')
          .order('tahun_mulai', { ascending: true })

        // Fetch latest 3 pengalamans
        const { data: pengalamanData } = await supabase
          .from('pengalamans')
          .select('*')
          .order('tanggal_mulai', { ascending: false })
          .limit(3)

        // Fetch latest 3 projects
        const { data: projectData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3)

        setProfile(profileData)
        setPendidikans(pendidikanData || [])
        setPengalamans(pengalamanData || [])
        setProjects(projectData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Scroll to section when hash is present
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
  }, [location, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section id="profil" className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollAnimate>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {profile?.nama || 'Nama Anda'}
                </h1>
                <p className="text-lg text-white/60 mb-6">
                  {profile?.deskripsi || 'Deskripsi tentang diri Anda'}
                </p>
                <div className="flex gap-4">
                  {profile?.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                  )}
                  {profile?.instagram && (
                    <a href={profile.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                  )}
                </div>
              </div>
              {profile?.foto_url && (
                <div className="shrink-0">
                  <img
                    src={profile.foto_url}
                    alt={profile.nama}
                    className="w-48 h-48 rounded-full object-cover border-4 border-white/10"
                  />
                </div>
              )}
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* Pendidikan Section */}
      {pendidikans.length > 0 && (
        <section id="pendidikan" className="py-12">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <ScrollAnimate>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Pendidikan</h2>
            </ScrollAnimate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {pendidikans.map((item, index) => (
                <ScrollAnimate key={item.id} delay={index * 100} className="h-full">
                  <div className="h-full p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.nama_institusi}</h3>
                    <p className="text-emerald-400 font-medium mb-2">{item.jurusan}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.tahun_mulai} — {item.tahun_selesai || 'Sekarang'}
                    </p>
                    {item.deskripsi && (
                      <p className="text-gray-400 text-sm">{item.deskripsi}</p>
                    )}
                  </div>
                </ScrollAnimate>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pengalaman Section */}
      <section id="pengalaman" className="py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollAnimate>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Pengalaman Organisasi</h2>
          </ScrollAnimate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* HIMA Card */}
            <ScrollAnimate delay={100} className="h-full">
              <Link
                to="/pengalaman/hima"
                className="group h-full flex flex-col rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden"
              >
                <div className="px-5 pt-5 pb-3" style={{ minHeight: '70px' }}>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {profile?.judul_hima || 'HIMA'}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
                    {profile?.deskripsi_hima || 'Himpunan Mahasiswa Informatika'}
                  </p>
                </div>
                <div className="px-5 flex-1">
                  <div className="w-full h-48 relative rounded-xl overflow-hidden bg-white/[0.05] border border-white/5">
                    {profile?.foto_hima_url ? (
                      <img
                        src={profile.foto_hima_url}
                        alt="HIMA"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                        <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <span>Lihat Pengalaman</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            </ScrollAnimate>

            {/* BEM Card */}
            <ScrollAnimate delay={200} className="h-full">
              <Link
                to="/pengalaman/bem"
                className="group h-full flex flex-col rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
              >
                <div className="px-5 pt-5 pb-3" style={{ minHeight: '70px' }}>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {profile?.judul_bem || 'BEM'}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
                    {profile?.deskripsi_bem || 'Badan Eksekutif Mahasiswa'}
                  </p>
                </div>
                <div className="px-5 flex-1">
                  <div className="w-full h-48 relative rounded-xl overflow-hidden bg-white/[0.05] border border-white/5">
                    {profile?.foto_bem_url ? (
                      <img
                        src={profile.foto_bem_url}
                        alt="BEM"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <span>Lihat Pengalaman</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Project Section */}
      {projects.length > 0 && (
        <section id="project" className="py-12">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <ScrollAnimate>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Project</h2>
                <Link to="/project" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  Lihat Semua →
                </Link>
              </div>
            </ScrollAnimate>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ScrollAnimate key={project.id} delay={index * 100}>
                  <div className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300">
                    {project.gambar_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={project.gambar_url}
                          alt={project.judul}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2">{project.judul}</h3>
                      {project.deskripsi && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.deskripsi}</p>
                      )}
                      {project.teknologi && project.teknologi.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.teknologi.map((tech, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-md bg-emerald-500/10 text-emerald-400">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {project.link_github && (
                          <a href={project.link_github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          </a>
                        )}
                        {project.link_demo && (
                          <a href={project.link_demo} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
