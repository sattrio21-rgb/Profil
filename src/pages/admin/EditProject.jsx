import { useEffect, useState } from 'react'
import { supabase, uploadFile } from '../../lib/supabase'

const EditProject = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [gambar, setGambar] = useState(null)

  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    link_github: '',
    link_demo: '',
    teknologi: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    setProjects(data || [])
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({
      judul: '',
      deskripsi: '',
      link_github: '',
      link_demo: '',
      teknologi: '',
    })
    setEditingId(null)
    setShowForm(false)
    setGambar(null)
  }

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || '',
      link_github: item.link_github || '',
      link_demo: item.link_demo || '',
      teknologi: item.teknologi ? item.teknologi.join(', ') : '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      // Parse teknologi from comma-separated string to array
      const teknologiArray = formData.teknologi
        ? formData.teknologi.split(',').map(t => t.trim()).filter(t => t)
        : null

      let gambarUrl = null

      if (gambar) {
        gambarUrl = await uploadFile('gambar-project', gambar)
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update({
            judul: formData.judul,
            deskripsi: formData.deskripsi || null,
            link_github: formData.link_github || null,
            link_demo: formData.link_demo || null,
            teknologi: teknologiArray,
            gambar_url: gambarUrl || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)

        if (error) throw error
        setMessage('Project berhasil diupdate!')
      } else {
        // Create
        const { error } = await supabase
          .from('projects')
          .insert({
            judul: formData.judul,
            deskripsi: formData.deskripsi || null,
            link_github: formData.link_github || null,
            link_demo: formData.link_demo || null,
            teknologi: teknologiArray,
            gambar_url: gambarUrl,
          })

        if (error) throw error
        setMessage('Project berhasil ditambahkan!')
      }

      resetForm()
      fetchProjects()
    } catch (err) {
      setMessage('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('Project berhasil dihapus!')
      fetchProjects()
    } catch (err) {
      setMessage('Gagal menghapus: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            + Tambah Project
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
          message.includes('berhasil')
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Project' : 'Tambah Project'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teknologi</label>
                <input
                  type="text"
                  name="teknologi"
                  value={formData.teknologi}
                  onChange={handleChange}
                  placeholder="React, Tailwind CSS, Supabase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">Pisahkan dengan koma</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link GitHub</label>
                <input
                  type="url"
                  name="link_github"
                  value={formData.link_github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Demo</label>
                <input
                  type="url"
                  name="link_demo"
                  value={formData.link_demo}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGambar(e.target.files[0])}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <p className="mt-1 text-xs text-gray-500">Maksimal 2MB. Format: JPG, JPEG, PNG, WEBP</p>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {projects.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {projects.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {item.gambar_url ? (
                    <img src={item.gambar_url} alt={item.judul} className="w-20 h-14 rounded-lg object-cover" />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.judul}</h4>
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 line-clamp-1">{item.deskripsi}</p>
                    )}
                    {item.teknologi && item.teknologi.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.teknologi.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3 mt-2">
                      {item.link_github && (
                        <a href={item.link_github} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-700">
                          GitHub
                        </a>
                      )}
                      {item.link_demo && (
                        <a href={item.link_demo} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-700">
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            Belum ada data project.
          </div>
        )}
      </div>
    </div>
  )
}

export default EditProject
