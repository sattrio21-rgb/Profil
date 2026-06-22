import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EditPendidikan = () => {
  const [pendidikans, setPendidikans] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nama_institusi: '',
    jurusan: '',
    tahun_mulai: '',
    tahun_selesai: '',
    deskripsi: '',
  })

  useEffect(() => {
    fetchPendidikans()
  }, [])

  const fetchPendidikans = async () => {
    const { data } = await supabase
      .from('pendidikans')
      .select('*')
      .order('tahun_mulai', { ascending: true })

    setPendidikans(data || [])
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({
      nama_institusi: '',
      jurusan: '',
      tahun_mulai: '',
      tahun_selesai: '',
      deskripsi: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setFormData({
      nama_institusi: item.nama_institusi,
      jurusan: item.jurusan,
      tahun_mulai: item.tahun_mulai,
      tahun_selesai: item.tahun_selesai || '',
      deskripsi: item.deskripsi || '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('pendidikans')
          .update({
            ...formData,
            tahun_selesai: formData.tahun_selesai || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)

        if (error) throw error
        setMessage('Pendidikan berhasil diupdate!')
      } else {
        // Create
        const { error } = await supabase
          .from('pendidikans')
          .insert({
            ...formData,
            tahun_selesai: formData.tahun_selesai || null,
          })

        if (error) throw error
        setMessage('Pendidikan berhasil ditambahkan!')
      }

      resetForm()
      fetchPendidikans()
    } catch (err) {
      setMessage('Gagal menyimpan: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pendidikan ini?')) return

    try {
      const { error } = await supabase
        .from('pendidikans')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage('Pendidikan berhasil dihapus!')
      fetchPendidikans()
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
        <h1 className="text-2xl font-bold text-gray-900">Edit Pendidikan</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            + Tambah Pendidikan
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
            {editingId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi *</label>
                <input
                  type="text"
                  name="nama_institusi"
                  value={formData.nama_institusi}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan *</label>
                <input
                  type="text"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Mulai *</label>
                <input
                  type="text"
                  name="tahun_mulai"
                  value={formData.tahun_mulai}
                  onChange={handleChange}
                  required
                  placeholder="contoh: 2021"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Selesai</label>
                <input
                  type="text"
                  name="tahun_selesai"
                  value={formData.tahun_selesai}
                  onChange={handleChange}
                  placeholder="Kosongkan jika masih aktif"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
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
        {pendidikans.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {pendidikans.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.nama_institusi}</h3>
                    <p className="text-sm text-emerald-600">{item.jurusan}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.tahun_mulai} — {item.tahun_selesai || 'Sekarang'}
                    </p>
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 mt-2">{item.deskripsi}</p>
                    )}
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
            Belum ada data pendidikan.
          </div>
        )}
      </div>
    </div>
  )
}

export default EditPendidikan
