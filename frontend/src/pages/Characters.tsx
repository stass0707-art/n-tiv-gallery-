import { Link } from "react-router-dom";
import { useState } from "react";
import { useGallery } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";

export default function Characters() {
  const { characters, updateCharacter } = useGallery();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setFlipped((s) => ({ ...s, [id]: !s[id] }));

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-24">
      <div className="narrativ-eyebrow mb-4">Люди</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-4">Персонажи</h1>
      <p className="text-[var(--n-mute)] max-w-2xl text-lg leading-relaxed mb-14">
        Художники, кураторы и педагоги, вокруг которых строится жизнь арт-центра.
        Нажмите на карточку, чтобы прочитать полную биографию.
      </p>

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {characters.map((c) => {
          const isFlipped = !!flipped[c.id];
          const short = c.bio.length > 140 ? c.bio.slice(0, 140).trimEnd() + "…" : c.bio;
          return (
            <article key={c.id} className={`narrativ-char-flip ${isFlipped ? "is-flipped" : ""}`}>
              <div
                className="narrativ-char-flip-inner"
                onClick={() => toggle(c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(c.id); } }}
                aria-label={`Раскрыть биографию: ${c.name}`}
              >
                {/* FRONT */}
                <div className="narrativ-char-face">
                  <div className="aspect-[4/5] overflow-hidden bg-[var(--n-passe)] p-3 shrink-0">
                    <EditableImage
                      value={c.thumb}
                      onSave={(v) => updateCharacter(c.id, { thumb: v })}
                      alt={c.name}
                      imgClassName="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="narrativ-eyebrow mb-2">
                      <EditableText value={c.role} onSave={(v) => updateCharacter(c.id, { role: v })} />
                    </div>
                    <h2 className="narrativ-serif text-3xl mb-3">
                      <EditableText value={c.name} onSave={(v) => updateCharacter(c.id, { name: v })} />
                    </h2>
                    <p className="text-[var(--n-mute)] leading-relaxed text-sm narrativ-bio-clamp">
                      {short}
                    </p>
                    <div className="mt-auto pt-4 text-xs uppercase tracking-[0.2em]" style={{ color: "var(--n-gold)" }}>
                      Читать полностью →
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className="narrativ-char-face narrativ-char-back">
                  <div className="narrativ-eyebrow mb-3">{c.role}</div>
                  <h3 className="narrativ-serif text-3xl mb-5">{c.name}</h3>
                  <EditableText
                    as="p"
                    multiline
                    className="text-[var(--n-ink)] leading-relaxed text-[15px] whitespace-pre-line"
                    value={c.bio}
                    onSave={(v) => updateCharacter(c.id, { bio: v })}
                  />
                  <div className="mt-6 pt-4 border-t flex items-center justify-between gap-4" style={{ borderColor: "rgba(197,160,89,0.25)" }}>
                    <Link
                      to={`//talks?character=${c.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="narrativ-link-underline text-sm"
                      style={{ color: "var(--n-gold)" }}
                    >
                      Все материалы →
                    </Link>
                    <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(197,160,89,0.7)" }}>
                      ← Назад
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
