import { getTranslations } from 'next-intl/server'
import GoldLine from '@/components/GoldLine'

export default async function AboutPage() {
  const t = await getTranslations('about')

  const values = [
    { title: t('v1'), desc: t('v1d'), icon: '💎' },
    { title: t('v2'), desc: t('v2d'), icon: '🚗' },
    { title: t('v3'), desc: t('v3d'), icon: '📞' },
    { title: t('v4'), desc: t('v4d'), icon: '📅' },
  ]

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Header */}
      <section className="bg-[#0a1628] py-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#d4a44c] mb-2">MimounRifCar</p>
        <h1 className="font-['Lora'] text-4xl md:text-5xl font-bold text-white">{t('title')}</h1>
        <GoldLine />
        <p className="text-white/60 max-w-2xl mx-auto mt-6 px-4">{t('subtitle')}</p>
      </section>

      {/* Values */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <h2 className="font-['Lora'] text-3xl font-bold text-[#0a1628] text-center mb-2">{t('values')}</h2>
        <GoldLine />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-white p-6 border border-gray-100 hover:border-[#d4a44c]/40 hover:shadow-lg transition-all text-center">
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-['Lora'] font-bold text-[#0a1628] mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '30+', label: t('stats1') },
            { num: '5,000+', label: t('stats2') },
            { num: '8+', label: t('stats3') },
            { num: '24/7', label: t('stats4') },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-4xl font-bold text-[#d4a44c]">{s.num}</p>
              <p className="text-white/60 text-sm tracking-widest uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
