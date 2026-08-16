import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGallery } from "../store";
import RetroArchiveStrip from "../components/RetroArchiveStrip";

export default function Talks() {
  const { posts, characters } = useGallery();
  const [params, setParams] = useSearchParams();
  const filter = params.get("character") ?? params.get("cat") ?? "all";

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    if (filter === "news") return posts.filter((p) => p.category === "news");
    return posts.filter((p) => p.characterId === filter);
  }, [posts, filter]);

  function setFilter(v: string) {
    if (v === "all") setParams({});
    else if (v === "news") setParams({ cat: "news" });
    else setParams({ character: v });
  }

  const chips = [
    { key: "all", label: "Все" },
    ...characters.map((c) => ({ key: c.id, label: c.name })),
    { key: "news", label: "Новости искусства" },
  ];

  return (
    <section className="narrativ-page-talks max-w-[1100px] mx-auto px-6 py-20 md:py-24">
      <div className="narrativ-eyebrow mb-4">Журнал</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-4">Разговоры об искусстве</h1>
      <p className="text-[var(--n-mute)] max-w-2xl text-lg leading-relaxed mb-6">
        Записи бесед с художниками, критические обзоры и новости искусства.
      </p>
      <RetroArchiveStrip />


      <div className="flex flex-wrap gap-2 pb-6 border-b border-[var(--n-line)] mb-12">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`narrativ-chip ${filter === c.key ? "is-active" : ""}`}
          >{c.label}</button>
        ))}
      </div>

      <div className="space-y-16">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--n-mute)]">Ничего не найдено.</div>
        )}
        {filtered.map((p) => {
          const character = characters.find((c) => c.id === p.characterId);
          return (
            <article key={p.id} className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
              <div className="aspect-[4/3] overflow-hidden bg-[var(--n-passe)] p-2">
                <img src={p.cover} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="narrativ-chip is-active">{p.category === "news" ? "Новости искусства" : character?.name ?? "Персонаж"}</span>
                  <span className="text-xs text-[var(--n-mute)] uppercase tracking-wider">{p.date}</span>
                </div>
                <h2 className="narrativ-serif text-3xl md:text-4xl mb-4">{p.title}</h2>
                <p className="text-[var(--n-mute)] leading-relaxed text-lg mb-3">{p.excerpt}</p>
                <p className="text-[var(--n-ink)] leading-relaxed">{p.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
