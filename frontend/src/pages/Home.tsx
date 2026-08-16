import { Link } from "react-router-dom";
import { useGallery, formatPrice } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";

export default function Home() {
  const { works, events, workshops, updateWork, updateEvent, updateWorkshop } = useGallery();
  const featured = works.filter((w) => w.featured).slice(0, 4);
  const currentEvent = events.find((e) => e.status === "current") ?? events[0];
  const recent = works.slice(0, 8);

  return (
    <>
      {currentEvent ? (
        <section style={{ borderBottom: "1px solid var(--n-line)" }}>
          <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-28 grid gap-12 md:grid-cols-2 items-center">
            <div>
              <div className="narrativ-eyebrow mb-6">
                Персональная выставка · <EditableText value={currentEvent.date} onSave={(v) => updateEvent(currentEvent.id, { date: v })} />
              </div>
              <h1 className="narrativ-serif text-5xl md:text-7xl lg:text-8xl leading-[0.98]">
                <EditableText value={currentEvent.title} onSave={(v) => updateEvent(currentEvent.id, { title: v })} />
              </h1>
              <EditableText
                as="p" multiline
                className="mt-8 text-lg text-[var(--n-mute)] max-w-md leading-relaxed"
                value={currentEvent.description}
                onSave={(v) => updateEvent(currentEvent.id, { description: v })}
              />
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="//collectors" className="narrativ-btn">Смотреть работы</Link>
                <Link to="//events" className="narrativ-btn-ghost">Афиша событий</Link>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--n-passe)] p-4">
              <EditableImage
                value={currentEvent.cover}
                onSave={(v) => updateEvent(currentEvent.id, { cover: v })}
                alt={currentEvent.title}
                imgClassName="w-full h-full object-contain"
              />
              <div className="absolute top-6 left-6 narrativ-promo px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                Сейчас в галерее
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section style={{ borderBottom: "1px solid var(--n-line)" }}>
          <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
            <div className="narrativ-eyebrow mb-6">Нарратив</div>
            <h1 className="narrativ-serif text-5xl md:text-7xl">Арт-центр в Наро-Фоминске</h1>
          </div>
        </section>
      )}

      {/* FEATURED */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="narrativ-eyebrow mb-3">Избранное</div>
            <h2 className="narrativ-serif text-4xl md:text-5xl">Работы месяца</h2>
          </div>
          <Link to="//collectors" className="narrativ-link-underline text-sm hidden md:inline">
            Все работы →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((w) => (
            <Link key={w.id} to={`//works/${w.slug}`} className="group narrativ-card block">
              <div className="aspect-[3/4] overflow-hidden bg-[var(--n-passe)] p-3">
                <EditableImage
                  value={w.image}
                  onSave={(v) => updateWork(w.id, { image: v })}
                  alt={w.title}
                  loading="lazy"
                  imgClassName="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="text-xs text-[var(--n-mute)] uppercase tracking-wider">
                  <EditableText value={w.author} onSave={(v) => updateWork(w.id, { author: v })} />
                </div>
                <div className="narrativ-serif text-xl mt-1">{w.title}</div>
                <div className="text-sm text-[var(--n-gold)] mt-1">{formatPrice(w.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RECENT */}
      <section style={{ borderTop: "1px solid var(--n-line)", background: "var(--n-bg-deep)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="narrativ-eyebrow mb-3">Новое в галерее</div>
          <h2 className="narrativ-serif text-3xl md:text-4xl mb-10">Свежие поступления</h2>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            {recent.map((w) => (
              <Link key={w.id} to={`//works/${w.slug}`} className="group block aspect-square overflow-hidden bg-[var(--n-passe)] p-1.5">
                <img src={w.image} alt={w.title} loading="lazy" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-24">
        <div className="narrativ-eyebrow mb-3">Афиша</div>
        <h2 className="narrativ-serif text-4xl md:text-5xl mb-12">Ближайшие события</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {events.slice(0, 3).map((e) => (
            <div key={e.id} className="group">
              <div className="aspect-[4/3] overflow-hidden bg-[var(--n-passe)] p-2">
                <EditableImage
                  value={e.cover}
                  onSave={(v) => updateEvent(e.id, { cover: v })}
                  alt={e.title}
                  imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="mt-5">
                <div className="text-xs text-[var(--n-gold)] uppercase tracking-[0.24em] font-semibold">
                  <EditableText value={e.date} onSave={(v) => updateEvent(e.id, { date: v })} />
                </div>
                <div className="narrativ-serif text-2xl mt-2">
                  <EditableText value={e.title} onSave={(v) => updateEvent(e.id, { title: v })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORKSHOPS */}
      <section style={{ borderTop: "1px solid var(--n-line)", background: "var(--n-surface)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <div className="narrativ-eyebrow mb-4">Мастер-классы</div>
              <h2 className="narrativ-serif text-4xl md:text-5xl">Учитесь у художников галереи</h2>
              <p className="mt-6 max-w-md text-lg text-[var(--n-mute)]">
                Каждые выходные — открытые занятия по акварели и графике. Для взрослых и подростков, материалы включены.
              </p>
              <Link to="//events" className="narrativ-btn mt-8">Смотреть расписание</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {workshops.map((ws) => (
                <div key={ws.id} className="p-5" style={{ background: "var(--n-bg)", border: "1px solid var(--n-line)" }}>
                  <div className="text-xs text-[var(--n-gold)] uppercase tracking-[0.22em] font-semibold">
                    <EditableText value={ws.date} onSave={(v) => updateWorkshop(ws.id, { date: v })} />
                  </div>
                  <div className="narrativ-serif text-2xl mt-2">
                    <EditableText value={ws.title} onSave={(v) => updateWorkshop(ws.id, { title: v })} />
                  </div>
                  <div className="text-sm text-[var(--n-mute)] mt-1">
                    <EditableText value={ws.teacher} onSave={(v) => updateWorkshop(ws.id, { teacher: v })} />
                  </div>
                  <div className="mt-3 text-[var(--n-gold)]">{formatPrice(ws.price)} <span className="text-sm text-[var(--n-mute)]">/ занятие</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
