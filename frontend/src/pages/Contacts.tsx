import { useGallery } from "../store";
import { EditableText } from "../edit/Editable";
import RetroArchiveStrip from "../components/RetroArchiveStrip";

export default function Contacts() {
  const { texts, updateText } = useGallery();
  return (
    <section className="narrativ-page-contacts max-w-[1400px] mx-auto px-6 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="narrativ-eyebrow mb-4">Как найти</div>
          <h1 className="narrativ-serif text-5xl md:text-6xl mb-6">Контакты</h1>
          <RetroArchiveStrip variant="factory" />
          <EditableText
            as="div"
            multiline
            className="text-lg leading-relaxed text-[var(--n-ink)]"
            value={texts.contacts}
            onSave={(v) => updateText("contacts", v)}
          />
        </div>
        <div className="aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden border border-[var(--n-line)]">
          <iframe
            title="Карта галереи Нарратив — Наро-Фоминск, ЖК Воскресенский"
            src="https://yandex.ru/map-widget/v1/?ll=36.727%2C55.386&z=16&pt=36.727,55.386,pm2rdm"
            className="w-full h-full min-h-[400px]"
            frameBorder={0}
          />
        </div>
      </div>
    </section>
  );
}
