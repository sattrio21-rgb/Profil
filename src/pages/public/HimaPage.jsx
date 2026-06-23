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
      <section className="pt-16 pb-6">
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
            <div className="space-y-4">
              {pengalamans.map((item, index) => (
                <ScrollAnimate key={item.id} delay={index * 100}>
                  <div className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                      {/* Foto */}
                      <div className="shrink-0">
                        {item.foto_url ? (
                          <img src={item.foto_url} alt={item.nama_organisasi} className="w-16 h-16 rounded-2xl object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h3 className="text-xl font-semibold text-white">{item.nama_organisasi}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                            {item.tanggal_selesai
                              ? ` — ${new Date(item.tanggal_selesai).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`
                              : ' — Sekarang'
                            }
                          </span>
                        </div>
                        <p className="text-emerald-400 font-medium mb-3">{item.jabatan}</p>
                        {item.deskripsi && (
                          <p className="text-gray-400 leading-relaxed">{item.deskripsi}</p>
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
