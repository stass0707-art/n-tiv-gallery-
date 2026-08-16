import { useGallery } from "../store";
import { EditableText } from "../edit/Editable";

export default function About() {
  const { texts, updateText } = useGallery();
  return (
    <>
      {/* HERO — тёмный, с золотыми силуэтами */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0f0e0d 0%, #141312 100%)", borderBottom: "1px solid var(--n-line)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32 relative">
          {/* Силуэт шёлковой фабрики + дачи Якунчиковой (упрощённая графика) */}
          <svg className="absolute inset-x-0 bottom-0 w-full h-40 md:h-56 opacity-40" viewBox="0 0 1400 200" preserveAspectRatio="none" fill="none" stroke="var(--n-gold)" strokeWidth="1">
            <path d="M0 200 L0 130 L60 130 L60 80 L140 80 L140 40 L180 40 L180 80 L260 80 L260 120 L320 120 L320 90 L400 90 L400 60 L460 60 L460 110 L560 110 L560 140 L640 140 L640 100 L720 100 L720 130 L820 130 L820 70 L860 70 L860 40 L900 40 L900 70 L960 70 L960 120 L1040 120 L1040 90 L1120 90 L1120 140 L1200 140 L1200 110 L1280 110 L1280 80 L1400 80 L1400 200 Z"/>
            {/* трубы фабрики */}
            <line x1="220" y1="80" x2="220" y2="20"/>
            <line x1="240" y1="80" x2="240" y2="10"/>
            <line x1="1060" y1="90" x2="1060" y2="30"/>
            {/* башенка усадьбы */}
            <path d="M870 40 L880 25 L890 40" />
            <line x1="880" y1="25" x2="880" y2="15"/>
          </svg>
          <div className="relative max-w-3xl">
            <div className="narrativ-eyebrow mb-6">О нас</div>
            <h1 className="narrativ-serif text-5xl md:text-7xl mb-8">Нарратив</h1>
            <EditableText
              as="p"
              multiline
              className="text-xl md:text-2xl leading-relaxed text-[var(--n-ink)] max-w-2xl"
              value={texts.aboutHero}
              onSave={(v) => updateText("aboutHero", v)}
            />
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-24">
        <div className="narrativ-eyebrow mb-4">Миссия</div>
        <h2 className="narrativ-serif text-4xl md:text-5xl mb-8">Связь микромира с макромиром искусства</h2>
        <EditableText
          as="div"
          multiline
          className="text-lg leading-relaxed text-[var(--n-ink)]"
          value={texts.about}
          onSave={(v) => updateText("about", v)}
        />
        <div className="narrativ-ornament">✦</div>
      </section>
    </>
  );
}
