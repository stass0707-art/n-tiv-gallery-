import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGallery, formatPrice } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";
import { useEdit } from "../edit/EditContext";

export default function Work() {
  const { slug } = useParams();
  const { works, addLead, updateWork, addToCollection, openCollection, collection } = useGallery();
  const { isEditing } = useEdit();

  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const work = works.find((w) => w.slug === slug);
  if (!work) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
        <div className="narrativ-serif text-3xl">Работа не найдена</div>
        <Link to="//works" className="mt-6 inline-block narrativ-btn">Вернуться в каталог</Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!work) return;
    if (!form.name || (!form.phone && !form.email)) return;
    addLead({
      workId: work.id, workTitle: work.title,
      name: form.name, phone: form.phone, email: form.email, message: form.message,
    });
    setSent(true);
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
      <Link to="//collectors" className="text-sm text-[var(--n-mute)] hover:text-[var(--n-gold)]">← В каталог</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="bg-[var(--n-passe)] p-6 md:p-10">
          <EditableImage
            value={work.image}
            onSave={(v) => updateWork(work.id, { image: v })}
            alt={work.title}
            imgClassName="w-full h-auto object-contain max-h-[75vh] mx-auto"
          />
        </div>

        <div>
          <div className="narrativ-eyebrow mb-3">
            <EditableText value={work.author} onSave={(v) => updateWork(work.id, { author: v })} />
            {" · "}
            <EditableText value={work.year} onSave={(v) => updateWork(work.id, { year: v })} />
          </div>
          <h1 className="narrativ-serif text-4xl md:text-5xl leading-tight">
            <EditableText value={work.title} onSave={(v) => updateWork(work.id, { title: v })} />
          </h1>
          <div className="mt-6 border-t border-b border-[var(--n-line)] py-6 space-y-3 text-sm">
            <Row label="Техника">
              <EditableText value={work.technique} onSave={(v) => updateWork(work.id, { technique: v })} />
            </Row>
            <Row label="Размер">
              <EditableText value={work.size} onSave={(v) => updateWork(work.id, { size: v })} />
            </Row>
            <Row label="Жанр">
              <span>{{ painting: "Живопись", graphic: "Графика", sculpture: "Скульптура" }[work.genre]}</span>
            </Row>
          </div>
          <div className="mt-6 text-3xl narrativ-serif">
            {isEditing ? (
              <>
                <EditableText value={String(work.price)} onSave={(v) => updateWork(work.id, { price: Number(v) || 0 })} />
                {" ₽"}
              </>
            ) : (
              formatPrice(work.price)
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!collection.includes(work.id)) { addToCollection(work.id); toast.success(`«${work.title}» отложено в коллекцию`); }
                openCollection();
              }}
              className="narrativ-btn"
            >
              {collection.includes(work.id) ? "Уже отложено ✓" : "Хочу в коллекцию"}
            </button>
            <button onClick={() => { setOpen(true); setSent(false); }} className="narrativ-btn-ghost">
              Оставить заявку
            </button>
          </div>

          <EditableText
            as="p"
            multiline
            className="mt-8 text-[var(--n-mute)] leading-relaxed"
            value={work.description}
            onSave={(v) => updateWork(work.id, { description: v })}
          />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            {sent ? (
              <div className="text-center py-6">
                <div className="narrativ-serif text-2xl">Заявка отправлена</div>
                <p className="mt-3 text-[var(--n-mute)]">Мы свяжемся с вами в течение рабочего дня.</p>
                <button className="narrativ-btn mt-6" onClick={() => setOpen(false)}>Закрыть</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="narrativ-eyebrow">Заявка на работу</div>
                <div className="narrativ-serif text-2xl">{work.title}</div>
                <input required placeholder="Имя" className="narrativ-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Телефон" className="narrativ-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input type="email" placeholder="Email" className="narrativ-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <textarea placeholder="Комментарий (необязательно)" rows={3} className="narrativ-input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <button type="submit" className="narrativ-btn w-full">Отправить</button>
                <p className="text-xs text-[var(--n-mute)]">Укажите телефон или email, чтобы менеджер мог связаться.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--n-mute)]">{label}</span>
      <span className="text-[var(--n-ink)] text-right">{children}</span>
    </div>
  );
}
