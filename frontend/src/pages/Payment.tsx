import { useGallery } from "../store";
import { EditableText } from "../edit/Editable";

export default function Payment() {
  const { texts, updateText } = useGallery();
  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="narrativ-eyebrow mb-4">Информация</div>
      <h1 className="narrativ-serif text-5xl md:text-6xl mb-10">Оплата и доставка</h1>
      <EditableText
        as="div"
        multiline
        className="text-lg leading-relaxed text-[var(--n-ink)]"
        value={texts.payment}
        onSave={(v) => updateText("payment", v)}
      />
    </section>
  );
}
