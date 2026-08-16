import { useState } from "react";
import { Link } from "react-router-dom";
import { useGallery } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";
import RetroArchiveStrip from "../components/RetroArchiveStrip";
import type { Exhibition, ExhibitionType } from "../types";

const SECTIONS: { key: ExhibitionType; label: string; eyebrow: string }[] = [
  { key: "exhibition",  label: "Выставки",      eyebrow: "Архив · выставки" },
  { key: "masterclass", label: "Мастер-классы", eyebrow: "Архив · мастер-классы" },
  { key: "competition", label: "Конкурсы",      eyebrow: "Архив · конкурсы" },
];

export default function Events() {
  const { events, updateEvent, exhibitions } = useGallery();
  const current = events.filter((e) => e.status === "current");

  return (
    <section className="narrativ-page-events max-w-[1400px] mx-auto px-6 py-20 md:py-24">
      <div className="narrativ-eyebrow mb-4">Афиша</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-8">События</h1>
      <RetroArchiveStrip />

      {/* Активные / ближайшие */}
      {current.length > 0 && (
        <div className="mb-20">
          <div className="narrativ-eyebrow mb-6">Сейчас и скоро</div>
          <div className="space-y-6">
            {current.map((e) => (
              <article key={e.id} className="grid gap-6 md:grid-cols-[280px_1fr] border-t border-[var(--n-line)] pt-6">
                <div className="aspect-[4/3] overflow-hidden bg-[var(--n-passe)] p-2">
                  <EditableImage value={e.cover} onSave={(v) => updateEvent(e.id, { cover: v })} alt={e.title} />
                </div>
                <div>
                  <div className="text-xs text-[var(--n-gold)] uppercase tracking-[0.24em] font-semibold mb-3">
                    <EditableText value={e.date} onSave={(v) => updateEvent(e.id, { date: v })} />
                  </div>
                  <h2 className="narrativ-serif text-4xl mb-4">
                    <EditableText value={e.title} onSave={(v) => updateEvent(e.id, { title: v })} />
                  </h2>
                  <EditableText as="p" multiline className="text-[var(--n-mute)] leading-relaxed text-lg"
                    value={e.description} onSave={(v) => updateEvent(e.id, { description: v })} />
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Три подраздела: Выставки / Мастер-классы / Конкурсы */}
      {SECTIONS.map((sec) => {
        const list = exhibitions.filter((x) => x.type === sec.key);
        if (list.length === 0) return null;
        return (
          <div key={sec.key} className="mb-20">
            <div className="narrativ-eyebrow mb-3">{sec.eyebrow}</div>
            <h2 className="narrativ-serif text-4xl md:text-5xl mb-8 border-b border-[var(--n-line)] pb-4">{sec.label}</h2>
            <div className="space-y-8">
              {list.map((x) => <ArchiveCard key={x.id} x={x} />)}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ArchiveCard({ x }: { x: Exhibition }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="narrativ-card">
      <div className="grid gap-6 md:grid-cols-[260px_1fr] p-6">
        <div className="aspect-[4/3] overflow-hidden bg-[var(--n-passe)] p-2">
          <img src={x.cover} alt={x.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-xs text-[var(--n-mute)] uppercase tracking-[0.2em] mb-2">{x.date}</div>
          <h3 className="narrativ-serif text-3xl mb-3">{x.title}</h3>
          <p className="text-[var(--n-mute)] leading-relaxed mb-4">{x.concept}</p>
          {x.participants.length > 0 && (
            <div className="text-sm text-[var(--n-ink)] mb-4">
              <span className="text-[var(--n-mute)]">Участники: </span>{x.participants.join(", ")}
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="narrativ-link-underline text-sm">
            {open ? "Свернуть" : "Подробнее →"}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[var(--n-line)] px-6 py-6 grid gap-8 md:grid-cols-3">
          <div>
            <div className="narrativ-eyebrow mb-3">Тематика</div>
            <p className="text-sm text-[var(--n-mute)] leading-relaxed">{x.thematic}</p>
          </div>
          <div>
            <div className="narrativ-eyebrow mb-3">Фотографии</div>
            <div className="grid grid-cols-2 gap-2">
              {x.photos.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-[var(--n-passe)] p-1">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="narrativ-eyebrow mb-3">Участники</div>
            <ul className="space-y-2 text-sm">
              {x.participants.map((name) => (
                <li key={name}>
                  <Link to={`//collectors?author=${encodeURIComponent(name)}`} className="narrativ-link-underline">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </article>
  );
}
