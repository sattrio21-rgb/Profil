import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ScrollAnimate from '../../components/ui/ScrollAnimate'

const ProjectPage = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      setProjects(data || [])
      setLoading(false)
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <section className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl">
            <Link to="/#project" replace className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Project</h1>
            <p className="text-lg text-white/60">Semua project yang pernah saya kerjakan.</p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {projects.length > 0 ? (
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
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Project</h3>
              <p className="text-gray-500">Project akan muncul di sini.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default ProjectPage
