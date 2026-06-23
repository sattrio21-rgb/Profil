import ScrollAnimate from '../ui/ScrollAnimate'

const PendidikanSection = ({ pendidikans }) => {
  if (pendidikans.length === 0) return null

  return (
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
  )
}

export default PendidikanSection
