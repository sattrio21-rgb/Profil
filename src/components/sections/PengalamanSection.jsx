import { Link } from 'react-router-dom'
import ScrollAnimate from '../ui/ScrollAnimate'

const PengalamanSection = ({ profile }) => {
  return (
    <section id="pengalaman" className="py-12">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollAnimate>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Pengalaman Organisasi</h2>
        </ScrollAnimate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-full">
          {/* HIMA Card */}
          <ScrollAnimate delay={200} className="h-130">
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
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-white/[0.05] border border-white/5">
                  {profile?.foto_hima_url ? (
                    <img
                      src={profile.foto_hima_url}
                      alt="HIMA"
                      className="w-full h-100 object-cover transition-transform duration-700 group-hover:scale-105"
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
          <ScrollAnimate delay={200} className="h-130">
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
                <div className="w-full h-full relative rounded-xl overflow-hidden bg-white/[0.05] border border-white/5">
                  {profile?.foto_bem_url ? (
                    <img
                      src={profile.foto_bem_url}
                      alt="BEM"
                      className="w-full h-100 object-cover transition-transform duration-700 group-hover:scale-105"
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
  )
}

export default PengalamanSection
