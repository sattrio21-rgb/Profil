                import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ScrollAnimate from '../ui/ScrollAnimate'

const PengalamanSection = () => {
  const [pengalamans, setPengalamans] = useState([])

  useEffect(() => {
    const fetchPengalamans = async () => {
      const { data } = await supabase
        .from('pengalamans')
        .select('*')
        .order('created_at', { ascending: false })

      setPengalamans(data || [])
    }
    fetchPengalamans()
  }, [])

  if (pengalamans.length === 0) return null

  return (
    <section id="pengalaman" className="py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollAnimate>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Pengalaman Organisasi</h2>
        </ScrollAnimate>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pengalamans.map((item, index) => (
            <ScrollAnimate key={item.id} delay={index * 100}>
              <div className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300">
                {/* Foto */}
                {item.foto_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.foto_url}
                      alt={item.nama_organisasi}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-emerald-500/10 flex items-center justify-center">
                    <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white line-clamp-1">{item.nama_organisasi}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full shrink-0 ${item.kategori === 'hima' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {item.kategori.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.jabatan}</p>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PengalamanSection
