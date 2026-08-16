import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGallery, formatPrice } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";
import { useEdit } from "../edit/EditContext";
import type { Genre } from "../types";

const GENRE_LABELS: Record<Genre | "all", string> = {
  all: "Все",
  painting: "Живопись",
  graphic: "Графика",
  sculpture: "Скульптура",
};

export default function Works() {
  const { works, updateWork } = useGallery();
  const { isEditing } = useEdit();
  const [genre, setGenre] = useState<Genre | "all">("all");
  const [author, setAuthor] = useState<string | "all">("all");
  const [sort, setSort] = useState<"new" | "price-asc" | "price-desc">("new");
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const authors = useMemo(() => {
    const map = new Map<string, number>();
    works.forEach((w) => map.set(w.author, (map.get(w.author) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "ru"));
  }, [works]);

  const filtered = useMemo(() => {
    let arr = works.filter((w) => genre === "all" || w.genre === genre);
    if (author !== "all") arr = arr.filter((w) => w.author === author);
    if (sort === "price-asc") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr = [...arr].sort((a, b) => b.price - a.price);
    return arr;
  }, [works, genre, author, sort]);

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
      <div className="narrativ-eyebrow mb-3">Коллекция</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-8">Картины</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--n-line)]">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(GENRE_LABELS) as (Genre | "all")[]).map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`narrativ-chip ${genre === g ? "is-active" : ""}`}
            >
              {GENRE_LABELS[g]}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="border border-[var(--n-line-strong)] px-3 py-2 text-sm bg-white"
        >
          <option value="new">Сначала новые</option>
          <option value="price-asc">Цена: по возрастанию</option>
          <option value="price-desc">Цена: по убыванию</option>
        </select>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_220px]">
        {/* Main grid */}
        <div>
          <div className="text-sm text-[var(--n-mute)] mb-6">
            Найдено: {filtered.length}
            {author !== "all" && (
              <>
                {" · "}
                <button
                  onClick={() => setAuthor("all")}
                  className="underline underline-offset-2 hover:text-[var(--n-ink)]"
                >
                  сбросить автора
                </button>
              </>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((w, idx) => {
              const isFlip = !isEditing && author === "all" && idx < 3 && !!w.authorBio;
              const front = (
                <>
                  <div className="aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
                    <EditableImage
                      value={w.image}
                      onSave={(v) => updateWork(w.id, { image: v })}
                      alt={w.title}
                      loading="lazy"
                      imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-[var(--n-mute)] uppercase tracking-wider">
                      <EditableText value={w.author} onSave={(v) => updateWork(w.id, { author: v })} />
                      {" · "}
                      <EditableText value={w.year} onSave={(v) => updateWork(w.id, { year: v })} />
                    </div>
                    <div className="narrativ-serif text-xl mt-1">
                      <EditableText value={w.title} onSave={(v) => updateWork(w.id, { title: v })} />
                    </div>
                    <div className="text-xs text-[var(--n-mute)] mt-1">
                      <EditableText value={w.technique} onSave={(v) => updateWork(w.id, { technique: v })} />
                      {" · "}
                      <EditableText value={w.size} onSave={(v) => updateWork(w.id, { size: v })} />
                    </div>
                    <div className="text-base mt-3 font-medium">
                      {isEditing ? (
                        <>
                          <EditableText
                            value={String(w.price)}
                            onSave={(v) => updateWork(w.id, { price: Number(v) || 0 })}
                          />{" ₽"}
                        </>
                      ) : (
                        formatPrice(w.price)
                      )}
                    </div>
                  </div>
                </>
              );

              if (isFlip) {
                const isFlipped = flippedId === w.id;
                return (
                  <Link
                    key={w.id}
                    to={`//works/${w.slug}`}
                    onClick={(e) => {
                      // На тач-устройствах первый тап переворачивает карточку,
                      // повторный тап (когда уже перевёрнута) открывает страницу.
                      const isTouch = window.matchMedia("(hover: none)").matches;
                      if (isTouch && !isFlipped) {
                        e.preventDefault();
                        setFlippedId(w.id);
                      }
                    }}
                    className={`group narrativ-flip block ${isFlipped ? "is-flipped" : ""}`}
                  >
                    <div className="narrativ-flip-inner">
                      <div className="narrativ-flip-face narrativ-card">{front}</div>
                      <div className="narrativ-flip-face narrativ-flip-back">
                        <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-3">
                          Об авторе
                        </div>
                        <div className="narrativ-serif text-2xl mb-1">{w.author}</div>
                        <div className="text-xs opacity-70 mb-4">{w.title} · {w.year}</div>
                        <p className="text-sm leading-relaxed opacity-90">{w.authorBio}</p>
                        <div className="mt-auto pt-4 text-[11px] uppercase tracking-[0.2em] opacity-60">
                          Нажмите, чтобы открыть →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              return isEditing ? (
                <div key={w.id} className="group narrativ-card">{front}</div>
              ) : (
                <Link key={w.id} to={`//works/${w.slug}`} className="group narrativ-card">{front}</Link>
              );
            })}
          </div>
        </div>

        {/* Author sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="narrativ-eyebrow mb-4">Авторы</div>
          <ul className="flex flex-col divide-y divide-[var(--n-line)] border-y border-[var(--n-line)]">
            <li>
              <button
                onClick={() => setAuthor("all")}
                className={`w-full text-left py-2.5 text-sm transition-colors ${
                  author === "all" ? "text-[var(--n-ink)] font-medium" : "text-[var(--n-mute)] hover:text-[var(--n-ink)]"
                }`}
              >
                Все авторы
                <span className="float-right text-xs opacity-60">{works.length}</span>
              </button>
            </li>
            {authors.map(([name, count]) => (
              <li key={name}>
                <button
                  onClick={() => setAuthor(name)}
                  className={`w-full text-left py-2.5 text-sm transition-colors ${
                    author === name ? "text-[var(--n-ink)] font-medium" : "text-[var(--n-mute)] hover:text-[var(--n-ink)]"
                  }`}
                >
                  {name}
                  <span className="float-right text-xs opacity-60">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
