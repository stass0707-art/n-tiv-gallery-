import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useGallery, formatPrice } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";
import { useEdit } from "../edit/EditContext";

export default function Collectors() {
  const { works, updateWork, addToCollection, openCollection, collection, texts, updateText } = useGallery();
  const { isEditing } = useEdit();
  const [params, setParams] = useSearchParams();
  const [letter, setLetter] = useState<string>("all");
  const author = params.get("author") ?? "all";

  useEffect(() => { setLetter("all"); }, [author]);

  const authors = useMemo(() => {
    const set = new Set<string>();
    works.forEach((w) => w.available !== false && set.add(w.author));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [works]);

  const letters = useMemo(() => {
    const s = new Set<string>();
    authors.forEach((a) => s.add(a.charAt(0).toUpperCase()));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "ru"));
  }, [authors]);

  const filtered = useMemo(() => {
    let arr = works.filter((w) => w.available !== false);
    if (author !== "all") arr = arr.filter((w) => w.author === author);
    if (letter !== "all") arr = arr.filter((w) => w.author.charAt(0).toUpperCase() === letter);
    return arr;
  }, [works, author, letter]);

  function want(w: typeof works[number]) {
    if (collection.includes(w.id)) { openCollection(); return; }
    addToCollection(w.id);
    toast.success(`«${w.title}» отложено в коллекцию`);
    openCollection();
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 md:py-24">
      <div className="narrativ-eyebrow mb-4">Каталог</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-6">Коллекционерам</h1>
      <EditableText
        as="p"
        multiline
        className="text-[var(--n-mute)] max-w-3xl text-lg leading-relaxed mb-12"
        value={texts.collectorsIntro}
        onSave={(v) => updateText("collectorsIntro", v)}
      />

      {/* A-Z фильтр */}
      <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[var(--n-line)]">
        <span className="text-xs text-[var(--n-mute)] uppercase tracking-[0.2em] mr-3">А–Я</span>
        <button onClick={() => setLetter("all")} className={`narrativ-chip ${letter === "all" ? "is-active" : ""}`}>Все</button>
        {letters.map((l) => (
          <button key={l} onClick={() => setLetter(l)} className={`narrativ-chip ${letter === l ? "is-active" : ""}`}>{l}</button>
        ))}
        {author !== "all" && (
          <button onClick={() => setParams({})} className="ml-auto text-sm narrativ-link-underline">
            Сбросить: {author} ×
          </button>
        )}
      </div>

      {/* Авторы-подсписок */}
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {authors
          .filter((a) => letter === "all" || a.charAt(0).toUpperCase() === letter)
          .map((a) => (
            <button
              key={a}
              onClick={() => setParams({ author: a })}
              className={`transition-colors ${author === a ? "text-[var(--n-gold)]" : "text-[var(--n-mute)] hover:text-[var(--n-ink)]"}`}
            >{a}</button>
          ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => (
          <div key={w.id} className="group narrativ-card flex flex-col">
            <Link to={`//works/${w.slug}`} className="block aspect-[3/4] overflow-hidden bg-[var(--n-passe)] p-4">
              <EditableImage
                value={w.image}
                onSave={(v) => updateWork(w.id, { image: v })}
                alt={w.title}
                loading="lazy"
                imgClassName="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
              />
            </Link>
            <div className="p-5 flex-1 flex flex-col">
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
              <div className="text-lg mt-3 text-[var(--n-gold)]">
                {isEditing
                  ? <><EditableText value={String(w.price)} onSave={(v) => updateWork(w.id, { price: Number(v) || 0 })} />{" ₽"}</>
                  : formatPrice(w.price)}
              </div>
              <button onClick={() => want(w)} className="narrativ-btn mt-5 w-full">
                {collection.includes(w.id) ? "Уже отложено ✓" : "Хочу в коллекцию"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-[var(--n-mute)]">В этом разделе пока нет работ.</div>
      )}
    </section>
  );
}
