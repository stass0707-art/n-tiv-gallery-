import { useState } from "react";
import { toast } from "sonner";
import { useGallery, formatPrice } from "../store";

export default function CollectionDrawer() {
  const { collection, works, collectionOpen, closeCollection, removeFromCollection, clearCollection, addLead } = useGallery();
  const [form, setForm] = useState({ name: "", phone: "", note: "" });
  const [sent, setSent] = useState(false);

  const items = collection.map((id) => works.find((w) => w.id === id)).filter(Boolean) as typeof works;
  const total = items.reduce((sum, w) => sum + w.price, 0);

  if (!collectionOpen) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Укажите имя и телефон / Telegram");
      return;
    }
    const list = items.map((w) => `— ${w.author}, «${w.title}» (${formatPrice(w.price)})`).join("\n");
    addLead({
      workId: items.map((w) => w.id).join(","),
      workTitle: `Коллекция: ${items.length} работ(ы) на ${formatPrice(total)}`,
      name: form.name,
      phone: form.phone,
      email: "",
      message: `${form.note}\n\nСостав:\n${list}`.trim(),
    });
    setSent(true);
    clearCollection();
    toast.success("Заявка отправлена. Мы свяжемся с вами в рабочее время.");
  }

  return (
    <>
      <div className="narrativ-drawer-backdrop" onClick={closeCollection} />
      <aside className="narrativ-drawer" role="dialog" aria-label="Отложено в коллекцию">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--n-line)]">
          <div>
            <div className="narrativ-eyebrow">Ваш выбор</div>
            <div className="narrativ-serif text-2xl mt-1">Отложено в коллекцию</div>
          </div>
          <button onClick={closeCollection} aria-label="Закрыть" className="text-[var(--n-mute)] hover:text-[var(--n-gold)] text-2xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 && !sent && (
            <div className="text-center py-16 text-[var(--n-mute)]">
              Пока пусто. Отметьте работы кнопкой «Хочу в коллекцию».
            </div>
          )}
          {sent && (
            <div className="text-center py-16">
              <div className="narrativ-serif text-2xl text-[var(--n-gold)]">Спасибо</div>
              <p className="mt-3 text-[var(--n-mute)]">Мы свяжемся с вами в течение рабочего дня.</p>
            </div>
          )}
          {!sent && items.map((w) => (
            <div key={w.id} className="flex gap-4 border-b border-[var(--n-line)] pb-4">
              <div className="w-20 h-20 bg-[var(--n-passe)] p-1.5 shrink-0">
                <img src={w.image} alt={w.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--n-mute)] uppercase tracking-wider">{w.author}</div>
                <div className="narrativ-serif text-lg truncate">{w.title}</div>
                <div className="text-sm text-[var(--n-gold)] mt-1">{formatPrice(w.price)}</div>
              </div>
              <button onClick={() => removeFromCollection(w.id)} className="text-[var(--n-mute)] hover:text-red-400 text-sm self-start">Убрать</button>
            </div>
          ))}
        </div>

        {items.length > 0 && !sent && (
          <form onSubmit={submit} className="border-t border-[var(--n-line)] px-6 py-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[var(--n-mute)] uppercase tracking-wider">Итого</span>
              <span className="narrativ-serif text-2xl text-[var(--n-gold)]">{formatPrice(total)}</span>
            </div>
            <input required placeholder="Имя" className="narrativ-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required placeholder="Телефон или @telegram" className="narrativ-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <textarea placeholder="Комментарий (необязательно)" rows={2} className="narrativ-input resize-none" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <button type="submit" className="narrativ-btn w-full">Отправить запрос</button>
          </form>
        )}
      </aside>
    </>
  );
}
