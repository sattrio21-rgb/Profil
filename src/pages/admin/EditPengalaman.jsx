import { useEffect, useState, useRef } from 'react'
import { supabase, uploadFile } from '../../lib/supabase'

const EditPengalaman = () => {
  const [profile, setProfile] = useState(null)
  const [pengalamans, setPengalamans] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [foto, setFoto] = useState(null)
  const formRef = useRef(null)

  // Form data untuk foto organisasi
  const [orgFormData, setOrgFormData] = useState({
    judul_hima: '',
    deskripsi_hima: '',
    judul_bem: '',
    deskripsi_bem: '',
  })
  const [fotoHima, setFotoHima] = useState(null)
  const [fotoBem, setFotoBem] = useState(null)

  // Form data untuk pengalaman
  const [formData, setFormData] = useState({
    nama_organisasi: '',
    jabatan: '',
    deskripsi: '',
    kategori: 'hima',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    const { data: pengalamanData } = await supabase
      .from('pengalamans')
      .select('*')
      .order('tanggal_mulai', { ascending: false })

    if (profileData) {
      setProfile(profileData)
      setOrgFormData({
        judul_hima: profileData.judul_hima || '',
        deskripsi_hima: profileData.deskripsi_hima || '',
        judul_bem: profileData.judul_bem || '',
        deskripsi_bem: profileData.deskripsi_bem || '',
      })
    }

    setPengalamans(pengalamanData || [])
    setLoading(false)
  }

  const handleOrgChange = (e) => {
    setOrgFormData({ ...orgFormData, [e.target.name]: e.target.value })
  }

  const handleOrgSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      let fotoHimaUrl = profile?.foto_hima_url
      let fotoBemUrl = profile?.foto_bem_url

      if (fotoHima) {
        fotoHimaUrl = await uploadFile('foto-organisasi', fotoHima, profile?.foto_hima_url)
      }
      if (fotoBem) {
        fotoBemUrl = await uploadFile('foto-organisasi', fotoBem, profile?.foto_bem_url)
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          ...orgFormData,
          foto_hima_url: fotoHimaUrl,
          foto_bem_url: fotoBemUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      setMessage('Foto organisasi berhasil disimpan!')
      setProfile({ ...profile, ...orgFormData, foto_hima_url: fotoHimaUrl, foto_bem_url: fotoBemUrl })
      setFotoHima(null)
      setFotoBem(null)
    } catch (err) {
      setMessage('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePengalamanChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({
      nama_organisasi: '',
      jabatan: '',
      deskripsi: '',
      kategori: 'hima',
    })
    setEditingId(null)
    setShowForm(false)
    setFoto(null)
  }

  const handleEdit = (item) => {
    setFormData({
      nama_organisasi: item.nama_organisasi,
      jabatan: item.jabatan,
      deskripsi: item.deskripsi || '',
      kategori: item.kategori,
    })
    setEditingId(item.id)
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handlePengalamanSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      let fotoUrl = null

      if (foto) {
        fotoUrl = await uploadFile('foto-pengalaman', foto)
      }

      if (editingId) {
        // Update
        const { error } = await supabase
          .from('pengalamans')
          .update({
            ...formData,
            tanggal_mulai: new Date().toISOString().split('T')[0],
            foto_url: fotoUrl || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)

        if (error) throw error
        setMessage('Pengalaman berhasil diupdate!')
      } else {
        // Create
        const { error } = await supabase
          .from('pengalamans')
          .insert({
            ...formData,
            tanggal_mulai: new Date().toISOString().split('T')[0],
            foto_url: fotoUrl,
          })

        if (error) throw error
        setMessage('Pengalaman berhasil ditambahkan!')
      }

      resetForm()
      fetchData()
    } catch (err) {
      setMessage('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pengalaman ini?')) return

    try {
      const { error } = await supabase
        .from('pengalamans')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('Pengalaman berhasil dihapus!')
      fetchData()
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Pengalaman</h1>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
          message.includes('berhasil')
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Foto Organisasi Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Foto Organisasi</h2>
        <form onSubmit={handleOrgSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HIMA */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">HIMA</h3>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Judul</label>
                <input
                  type="text"
                  name="judul_hima"
                  value={orgFormData.judul_hima}
                  onChange={handleOrgChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Deskripsi</label>
                <input
                  type="text"
                  name="deskripsi_hima"
                  value={orgFormData.deskripsi_hima}
                  onChange={handleOrgChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Foto</label>
                {profile?.foto_hima_url && (
                  <img src={profile.foto_hima_url} alt="HIMA" className="w-16 h-16 rounded-lg object-cover mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoHima(e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>

            {/* BEM */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">BEM</h3>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Judul</label>
                <input
                  type="text"
                  name="judul_bem"
                  value={orgFormData.judul_bem}
                  onChange={handleOrgChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Deskripsi</label>
                <input
                  type="text"
                  name="deskripsi_bem"
                  value={orgFormData.deskripsi_bem}
                  onChange={handleOrgChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Foto</label>
                {profile?.foto_bem_url && (
                  <img src={profile.foto_bem_url} alt="BEM" className="w-16 h-16 rounded-lg object-cover mb-2" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoBem(e.target.files[0])}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>

      {/* Daftar Pengalaman Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pengalaman</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              + Tambah Pengalaman
            </button>
          )}
        </div>

        {/* Form Tambah/Edit Pengalaman */}
        {showForm && (
          <div ref={formRef} className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-700 mb-3">
              {editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
            </h3>
            <form onSubmit={handlePengalamanSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nama Program Kerja </label>
                  <input
                    type="text"
                    name="nama_organisasi"
                    value={formData.nama_organisasi}
                    onChange={handlePengalamanChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Divisi </label>
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handlePengalamanChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Kategori </label>
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handlePengalamanChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="hima">HIMA</option>
                    <option value="bem">BEM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handlePengalamanChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
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
        {pengalamans.length > 0 ? (
          <div className="space-y-3">
            {pengalamans.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                {item.foto_url ? (
                  <img src={item.foto_url} alt={item.nama_organisasi} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{item.nama_organisasi}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${item.kategori === 'hima' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {item.kategori.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.jabatan}</p>
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
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Belum ada data pengalaman.
          </div>
        )}
      </div>
    </div>
  )
}

export default EditPengalaman
