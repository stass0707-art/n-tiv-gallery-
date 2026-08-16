import { useGallery, formatPrice } from "../store";
import { EditableText, EditableImage } from "../edit/Editable";
import { useEdit } from "../edit/EditContext";

export default function Workshops() {
  const { workshops, updateWorkshop } = useGallery();
  const { isEditing } = useEdit();
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
      <div className="narrativ-eyebrow mb-3">Расписание</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-12">Мастер-классы</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {workshops.map((ws) => (
          <article key={ws.id} className="narrativ-card">
            <div className="aspect-[16/10] overflow-hidden">
              <EditableImage value={ws.cover} onSave={(v) => updateWorkshop(ws.id, { cover: v })} alt={ws.title} />
            </div>
            <div className="p-6">
              <div className="text-xs text-[var(--n-gold)] uppercase tracking-wider font-bold">
                <EditableText value={ws.date} onSave={(v) => updateWorkshop(ws.id, { date: v })} />
              </div>
              <h2 className="narrativ-serif text-2xl mt-3">
                <EditableText value={ws.title} onSave={(v) => updateWorkshop(ws.id, { title: v })} />
              </h2>
              <div className="text-sm text-[var(--n-mute)] mt-1">
                Ведёт <EditableText value={ws.teacher} onSave={(v) => updateWorkshop(ws.id, { teacher: v })} />
              </div>
              <EditableText as="p" multiline className="mt-4 text-[var(--n-mute)] leading-relaxed"
                value={ws.description} onSave={(v) => updateWorkshop(ws.id, { description: v })} />
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xl narrativ-serif">
                  {isEditing ? (
                    <>
                      <EditableText value={String(ws.price)} onSave={(v) => updateWorkshop(ws.id, { price: Number(v) || 0 })} />
                      {" ₽"}
                    </>
                  ) : formatPrice(ws.price)}
                </div>
                <button className="narrativ-btn">Записаться</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
