import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import ScrollAnimate from '../../components/ui/ScrollAnimate'

const HimaPage = () => {
  const [profile, setProfile] = useState(null)
  const [pengalamans, setPengalamans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single()

      const { data: pengalamanData } = await supabase
        .from('pengalamans')
        .select('*')
        .eq('kategori', 'hima')
        .order('tanggal_mulai', { ascending: false })

      setProfile(profileData)
      setPengalamans(pengalamanData || [])
      setLoading(false)
    }
    fetchData()
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
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl">
            <Link to="/#pengalaman" replace className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
              Kembali
            </Link>
            <div className="mb-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                {profile?.judul_hima || 'Ketua Departemen Kreativitas dan Olahraga'}
              </h1>
              <p className="text-lg text-gray-400">
                {profile?.deskripsi_hima || 'Himpunan Mahasiswa Teknologi Informasi'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience List */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {pengalamans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pengalamans.map((item, index) => (
                <ScrollAnimate key={item.id} delay={index * 100}>
                  <div className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300">
                    {/* Foto */}
                    {item.foto_url ? (
                      <div className="aspect-video overflow-hidden">
                        <img src={item.foto_url} alt={item.nama_organisasi} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-emerald-500/10 flex items-center justify-center">
                        <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{item.nama_organisasi}</h3>
                      <p className="text-emerald-400 font-medium text-sm">{item.jabatan}</p>
                    </div>
                  </div>
                </ScrollAnimate>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Pengalaman HIMA</h3>
              <p className="text-gray-500">Pengalaman HIMA akan muncul di sini.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default HimaPage
