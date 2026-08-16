import { useState } from "react";
import { Link } from "react-router-dom";
import { useGallery, formatPrice } from "../store";
import { generateUUID } from "../lib/utils";
import type {
  Work, GalleryEvent, Workshop, Genre, EventStatus,
  Character, Post, PostCategory, Exhibition, ExhibitionType,
} from "../types";

type Tab =
  | "about"
  | "characters"
  | "events"
  | "talks"
  | "collectors"
  | "contacts"
  | "leads";

const TABS: { key: Tab; label: string; hint: string }[] = [
  { key: "about",       label: "О нас",                   hint: "Тексты страницы «О нас»" },
  { key: "characters",  label: "Персонажи",               hint: "Художники и педагоги" },
  { key: "events",      label: "События",                 hint: "Афиша, архив, мастер-классы" },
  { key: "talks",       label: "Разговоры об искусстве",  hint: "Статьи, беседы, новости" },
  { key: "collectors",  label: "Коллекционерам",          hint: "Работы на продажу и вступление" },
  { key: "contacts",    label: "Контакты",                hint: "Адрес, телефон, оплата и доставка" },
  { key: "leads",       label: "Заявки",                  hint: "Заявки клиентов" },
];

export default function Admin() {
  const { role, resetDemo, leads } = useGallery();
  const [tab, setTab] = useState<Tab>("about");

  if (role === "guest") {
    return (
      <section className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="narrativ-eyebrow mb-3">Требуется вход</div>
        <h1 className="narrativ-serif text-3xl mb-4">Только для сотрудников галереи</h1>
        <p className="text-[var(--n-mute)] mb-6">
          Войдите как редактор или администратор, чтобы редактировать содержимое сайта.
        </p>
        <Link to="/admin/login" className="narrativ-btn">Войти</Link>
      </section>
    );
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="narrativ-eyebrow mb-2">Панель управления</div>
          <h1 className="narrativ-serif text-4xl">Админка</h1>
          <p className="text-sm text-[var(--n-mute)] mt-2 max-w-2xl">
            Вкладки соответствуют разделам в верхнем меню сайта. Выберите нужный раздел — и правьте его содержимое.
          </p>
        </div>
        <div className="text-sm text-[var(--n-mute)]">
          Роль: <b className="text-[var(--n-ink)]">{role}</b>
        </div>
      </div>

      <div className="mb-6 p-4 border border-[var(--n-line)] bg-[#fafaf7] text-sm leading-relaxed">
        <div className="narrativ-eyebrow mb-2">Как редактировать</div>
        <ol className="list-decimal pl-5 space-y-1 text-[var(--n-mute)]">
          <li>Выберите раздел ниже — он соответствует пункту меню на сайте.</li>
          <li>Кнопка <b>«+ Добавить»</b> создаёт новую запись, <b>«Изм.»</b> — открывает форму.</li>
          <li>В форме в поле <b>«Изображение»</b> можно загрузить файл с компьютера или вставить ссылку.</li>
          <li>Все изменения сохраняются на сервере и сразу появляются на сайте.</li>
        </ol>
        <button
          onClick={() => { if (confirm("Сбросить весь контент к исходному демо?")) resetDemo(); }}
          className="mt-3 text-xs text-red-600 hover:underline"
        >
          Сбросить демо-контент к исходному
        </button>
      </div>

      <div className="flex gap-1 border-b border-[var(--n-line)] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            title={t.hint}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-[var(--n-ink)] text-[var(--n-ink)]" : "border-transparent text-[var(--n-mute)] hover:text-[var(--n-ink)]"
            }`}
          >
            {t.label}
            {t.key === "leads" && leads.length > 0 && (
              <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 bg-[var(--n-ink)] text-white rounded-full">{leads.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "about"      && <AboutTab />}
        {tab === "characters" && <CharactersTab />}
        {tab === "events"     && <EventsTab />}
        {tab === "talks"      && <TalksTab />}
        {tab === "collectors" && <CollectorsTab />}
        {tab === "contacts"   && <ContactsTab />}
        {tab === "leads"      && <LeadsTab />}
      </div>
    </section>
  );
}

/* ─────────────────── ABOUT ─────────────────── */
function AboutTab() {
  const { texts, updateText } = useGallery();
  const [draft, setDraft] = useState(texts);
  async function save() {
    await Promise.all([
      updateText("aboutHero", draft.aboutHero),
      updateText("about", draft.about),
    ]);
    alert("Сохранено");
  }
  return (
    <PageSection
      title="Страница «О нас»"
      pageHref="//about"
      description="Заголовок героя и текст миссии галереи."
    >
      <div className="space-y-6 max-w-3xl">
        <Field label="Вступление в героя (короткий подзаголовок)">
          <textarea rows={3} className="narrativ-input resize-y"
            value={draft.aboutHero}
            onChange={(e) => setDraft({ ...draft, aboutHero: e.target.value })} />
        </Field>
        <Field label="Основной текст «О нас» / Миссия">
          <textarea rows={8} className="narrativ-input resize-y"
            value={draft.about}
            onChange={(e) => setDraft({ ...draft, about: e.target.value })} />
        </Field>
        <SaveRow onSave={save} onCancel={() => setDraft(texts)} />
      </div>
    </PageSection>
  );
}

/* ─────────────────── CHARACTERS ─────────────────── */
function CharactersTab() {
  const { characters, saveCharacter, deleteCharacter } = useGallery();
  const [edit, setEdit] = useState<Character | null>(null);

  async function save(c: Character) {
    await saveCharacter(c);
    setEdit(null);
  }
  async function remove(id: string) {
    if (confirm("Удалить персонажа?")) {
      await deleteCharacter(id);
    }
  }
  function add() {
    setEdit({ id: generateUUID(), name: "", role: "", bio: "", thumb: "", videoUrl: "" });
  }

  return (
    <PageSection
      title="Страница «Персонажи»"
      pageHref="//characters"
      description="Художники, кураторы и педагоги галереи. Показываются карточками с флипом."
    >
      <div className="flex justify-between mb-4">
        <div className="text-sm text-[var(--n-mute)]">Всего персонажей: {characters.length}</div>
        <button className="narrativ-btn" onClick={add}>+ Добавить персонажа</button>
      </div>
      <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)]">
        {characters.map((c) => (
          <div key={c.id} className="flex items-center gap-4 p-3">
            <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden shrink-0">
              {c.thumb && <img src={c.thumb} alt={c.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="narrativ-serif text-lg truncate">{c.name || <i className="text-[var(--n-mute)]">Без имени</i>}</div>
              <div className="text-xs text-[var(--n-mute)] truncate">{c.role}</div>
            </div>
            <button className="text-sm narrativ-link-underline" onClick={() => setEdit(c)}>Изм.</button>
            <button className="text-sm text-red-600 hover:underline" onClick={() => remove(c.id)}>Удалить</button>
          </div>
        ))}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)} title="Персонаж">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Имя"><input className="narrativ-input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Роль / должность"><input className="narrativ-input" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value })} placeholder="Художник · куратор · педагог" /></Field>
            <div className="sm:col-span-2"><ImageField label="Портрет" value={edit.thumb} onChange={(v) => setEdit({ ...edit, thumb: v })} /></div>
            <Field label="Биография" full>
              <textarea rows={6} className="narrativ-input resize-y" value={edit.bio} onChange={(e) => setEdit({ ...edit, bio: e.target.value })} />
            </Field>
            <Field label="Видео (ссылка YouTube/VK, необязательно)" full>
              <input className="narrativ-input" value={edit.videoUrl ?? ""} onChange={(e) => setEdit({ ...edit, videoUrl: e.target.value })} placeholder="https://…" />
            </Field>
          </div>
          <SaveRow onSave={() => save(edit)} onCancel={() => setEdit(null)} />
        </Modal>
      )}
    </PageSection>
  );
}

/* ─────────────────── EVENTS ─────────────────── */
function EventsTab() {
  const { events, exhibitions, workshops, saveEvent, saveExhibition, saveWorkshop, deleteEvent, deleteExhibition, deleteWorkshop } = useGallery();
  const [editEvent, setEditEvent] = useState<GalleryEvent | null>(null);
  const [editEx, setEditEx] = useState<Exhibition | null>(null);
  const [editWs, setEditWs] = useState<Workshop | null>(null);

  async function onSaveEvent(x: GalleryEvent) {
    await saveEvent(x);
    setEditEvent(null);
  }
  async function removeEvent(id: string) { if (confirm("Удалить событие?")) await deleteEvent(id); }

  async function onSaveEx(x: Exhibition) {
    await saveExhibition(x);
    setEditEx(null);
  }
  async function removeEx(id: string) { if (confirm("Удалить запись архива?")) await deleteExhibition(id); }

  async function onSaveWs(x: Workshop) {
    await saveWorkshop(x);
    setEditWs(null);
  }
  async function removeWs(id: string) { if (confirm("Удалить мастер-класс?")) await deleteWorkshop(id); }

  return (
    <PageSection
      title="Страница «События»"
      pageHref="//events"
      description="Афиша «Сейчас и скоро», архив (выставки, мастер-классы, конкурсы), список мастер-классов."
    >
      {/* Афиша */}
      <SubHeader
        title="Афиша «Сейчас и скоро»"
        count={events.length}
        action={<button className="narrativ-btn" onClick={() => setEditEvent({ id: generateUUID(), title: "", date: "", cover: "", description: "", status: "current" })}>+ Добавить</button>}
      />
      <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)] mb-10">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-4 p-3">
            <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden shrink-0">
              {e.cover && <img src={e.cover} alt={e.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="narrativ-serif text-lg truncate">{e.title}</div>
              <div className="text-xs text-[var(--n-mute)]">{e.date}</div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${e.status === "current" ? "bg-[var(--n-promo)]" : "bg-[var(--n-line)]"}`}>
              {e.status === "current" ? "Сейчас" : "Архив"}
            </span>
            <button className="text-sm narrativ-link-underline" onClick={() => setEditEvent(e)}>Изм.</button>
            <button className="text-sm text-red-600 hover:underline" onClick={() => removeEvent(e.id)}>Удалить</button>
          </div>
        ))}
      </div>

      {/* Архив: три отдельных подраздела по типу */}
      {(["exhibition", "masterclass", "competition"] as ExhibitionType[]).map((tp) => {
        const list = exhibitions.filter((x) => x.type === tp);
        const addLabel =
          tp === "exhibition" ? "+ Добавить выставку" :
          tp === "masterclass" ? "+ Добавить мастер-класс" :
          "+ Добавить конкурс";
        const sectionTitle =
          tp === "exhibition" ? "Выставки" :
          tp === "masterclass" ? "Мастер-классы (архив)" :
          "Конкурсы";
        return (
          <div key={tp} className="mb-10">
            <SubHeader
              title={sectionTitle}
              count={list.length}
              action={
                <button
                  className="narrativ-btn"
                  onClick={() => setEditEx({ id: generateUUID(), title: "", date: "", cover: "", concept: "", type: tp, participants: [], photos: [], thematic: "" })}
                >
                  {addLabel}
                </button>
              }
            />
            <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)]">
              {list.length === 0 && (
                <div className="p-4 text-sm text-[var(--n-mute)]">Пока пусто. Нажмите «{addLabel}», чтобы создать запись — она появится отдельным блоком на странице «События».</div>
              )}
              {list.map((x) => (
                <div key={x.id} className="flex items-center gap-4 p-3">
                  <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden shrink-0">
                    {x.cover && <img src={x.cover} alt={x.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="narrativ-serif text-lg truncate">{x.title}</div>
                    <div className="text-xs text-[var(--n-mute)]">{x.date} · {typeLabel(x.type)}</div>
                  </div>
                  <button className="text-sm narrativ-link-underline" onClick={() => setEditEx(x)}>Изм.</button>
                  <button className="text-sm text-red-600 hover:underline" onClick={() => removeEx(x.id)}>Удалить</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Мастер-классы */}
      <SubHeader
        title="Мастер-классы (расписание и запись)"
        count={workshops.length}
        action={<button className="narrativ-btn" onClick={() => setEditWs({ id: generateUUID(), title: "", date: "", teacher: "", price: 0, cover: "", description: "" })}>+ Добавить</button>}
      />
      <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)]">
        {workshops.map((w) => (
          <div key={w.id} className="flex items-center gap-4 p-3">
            <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden shrink-0">
              {w.cover && <img src={w.cover} alt={w.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="narrativ-serif text-lg truncate">{w.title}</div>
              <div className="text-xs text-[var(--n-mute)]">{w.date} · {w.teacher}</div>
            </div>
            <div className="text-sm hidden sm:block">{formatPrice(w.price)}</div>
            <button className="text-sm narrativ-link-underline" onClick={() => setEditWs(w)}>Изм.</button>
            <button className="text-sm text-red-600 hover:underline" onClick={() => removeWs(w.id)}>Удалить</button>
          </div>
        ))}
      </div>

      {/* Формы */}
      {editEvent && (
        <Modal onClose={() => setEditEvent(null)} title="Событие афиши">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Заголовок" full><input className="narrativ-input" value={editEvent.title} onChange={(ev) => setEditEvent({ ...editEvent, title: ev.target.value })} /></Field>
            <Field label="Даты"><input className="narrativ-input" value={editEvent.date} onChange={(ev) => setEditEvent({ ...editEvent, date: ev.target.value })} placeholder="1–28 сентября 2026" /></Field>
            <Field label="Статус">
              <select className="narrativ-input" value={editEvent.status} onChange={(ev) => setEditEvent({ ...editEvent, status: ev.target.value as EventStatus })}>
                <option value="current">Сейчас в галерее</option>
                <option value="past">Архив</option>
              </select>
            </Field>
            <div className="sm:col-span-2"><ImageField label="Обложка события" value={editEvent.cover} onChange={(v) => setEditEvent({ ...editEvent, cover: v })} /></div>
            <Field label="Описание" full><textarea rows={4} className="narrativ-input resize-none" value={editEvent.description} onChange={(ev) => setEditEvent({ ...editEvent, description: ev.target.value })} /></Field>
          </div>
          <SaveRow onSave={() => onSaveEvent(editEvent)} onCancel={() => setEditEvent(null)} />
        </Modal>
      )}

      {editEx && (
        <Modal onClose={() => setEditEx(null)} title="Запись архива">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Название" full><input className="narrativ-input" value={editEx.title} onChange={(e) => setEditEx({ ...editEx, title: e.target.value })} /></Field>
            <Field label="Даты"><input className="narrativ-input" value={editEx.date} onChange={(e) => setEditEx({ ...editEx, date: e.target.value })} /></Field>
            <Field label="Тип">
              <select className="narrativ-input" value={editEx.type} onChange={(e) => setEditEx({ ...editEx, type: e.target.value as ExhibitionType })}>
                <option value="exhibition">Выставка</option>
                <option value="masterclass">Мастер-класс</option>
                <option value="competition">Конкурс</option>
              </select>
            </Field>
            <div className="sm:col-span-2"><ImageField label="Обложка" value={editEx.cover} onChange={(v) => setEditEx({ ...editEx, cover: v })} /></div>
            <Field label="Концепция" full><textarea rows={3} className="narrativ-input resize-y" value={editEx.concept} onChange={(e) => setEditEx({ ...editEx, concept: e.target.value })} /></Field>
            <Field label="Тематика" full><textarea rows={3} className="narrativ-input resize-y" value={editEx.thematic} onChange={(e) => setEditEx({ ...editEx, thematic: e.target.value })} /></Field>
            <Field label="Участники (через запятую)" full>
              <input className="narrativ-input" value={editEx.participants.join(", ")} onChange={(e) => setEditEx({ ...editEx, participants: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
            </Field>
            <Field label="Фото (ссылки через перенос строки)" full>
              <textarea rows={3} className="narrativ-input resize-y" value={editEx.photos.join("\n")} onChange={(e) => setEditEx({ ...editEx, photos: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} placeholder="https://…\nhttps://…" />
            </Field>
          </div>
          <SaveRow onSave={() => onSaveEx(editEx)} onCancel={() => setEditEx(null)} />
        </Modal>
      )}

      {editWs && (
        <Modal onClose={() => setEditWs(null)} title="Мастер-класс">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Название" full><input className="narrativ-input" value={editWs.title} onChange={(ev) => setEditWs({ ...editWs, title: ev.target.value })} /></Field>
            <Field label="Расписание"><input className="narrativ-input" value={editWs.date} onChange={(ev) => setEditWs({ ...editWs, date: ev.target.value })} /></Field>
            <Field label="Преподаватель"><input className="narrativ-input" value={editWs.teacher} onChange={(ev) => setEditWs({ ...editWs, teacher: ev.target.value })} /></Field>
            <Field label="Цена, ₽"><input type="number" className="narrativ-input" value={editWs.price} onChange={(ev) => setEditWs({ ...editWs, price: Number(ev.target.value) })} /></Field>
            <Field label="Описание" full><textarea rows={4} className="narrativ-input resize-none" value={editWs.description} onChange={(ev) => setEditWs({ ...editWs, description: ev.target.value })} /></Field>
            <div className="sm:col-span-2"><ImageField label="Обложка мастер-класса" value={editWs.cover} onChange={(v) => setEditWs({ ...editWs, cover: v })} /></div>
          </div>
          <SaveRow onSave={() => onSaveWs(editWs)} onCancel={() => setEditWs(null)} />
        </Modal>
      )}
    </PageSection>
  );
}

function typeLabel(t: ExhibitionType) {
  return t === "exhibition" ? "Выставка" : t === "masterclass" ? "Мастер-класс" : "Конкурс";
}

/* ─────────────────── TALKS (posts) ─────────────────── */
function TalksTab() {
  const { posts, savePost, deletePost, characters } = useGallery();
  const [edit, setEdit] = useState<Post | null>(null);

  async function save(p: Post) {
    await savePost(p);
    setEdit(null);
  }
  async function remove(id: string) { if (confirm("Удалить запись?")) await deletePost(id); }
  function add() {
    setEdit({ id: generateUUID(), title: "", date: "", excerpt: "", body: "", cover: "", category: "news", characterId: "", videoUrl: "" });
  }

  return (
    <PageSection
      title="Страница «Разговоры об искусстве»"
      pageHref="//talks"
      description="Статьи, беседы с художниками, новости искусства."
    >
      <div className="flex justify-between mb-4">
        <div className="text-sm text-[var(--n-mute)]">Всего записей: {posts.length}</div>
        <button className="narrativ-btn" onClick={add}>+ Добавить запись</button>
      </div>
      <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)]">
        {posts.map((p) => {
          const ch = characters.find((c) => c.id === p.characterId);
          return (
            <div key={p.id} className="flex items-center gap-4 p-3">
              <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden shrink-0">
                {p.cover && <img src={p.cover} alt={p.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="narrativ-serif text-lg truncate">{p.title}</div>
                <div className="text-xs text-[var(--n-mute)] truncate">
                  {p.date} · {p.category === "news" ? "Новости искусства" : `Персонаж: ${ch?.name ?? "—"}`}
                </div>
              </div>
              <button className="text-sm narrativ-link-underline" onClick={() => setEdit(p)}>Изм.</button>
              <button className="text-sm text-red-600 hover:underline" onClick={() => remove(p.id)}>Удалить</button>
            </div>
          );
        })}
      </div>
      {edit && (
        <Modal onClose={() => setEdit(null)} title="Запись журнала">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Заголовок" full><input className="narrativ-input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Дата"><input className="narrativ-input" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} placeholder="15 марта 2026" /></Field>
            <Field label="Категория">
              <select className="narrativ-input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as PostCategory })}>
                <option value="news">Новости искусства</option>
                <option value="character">Беседа с персонажем</option>
              </select>
            </Field>
            {edit.category === "character" && (
              <Field label="Персонаж" full>
                <select className="narrativ-input" value={edit.characterId ?? ""} onChange={(e) => setEdit({ ...edit, characterId: e.target.value })}>
                  <option value="">— выберите —</option>
                  {characters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
            )}
            <div className="sm:col-span-2"><ImageField label="Обложка" value={edit.cover} onChange={(v) => setEdit({ ...edit, cover: v })} /></div>
            <Field label="Краткий анонс" full><textarea rows={2} className="narrativ-input resize-y" value={edit.excerpt} onChange={(e) => setEdit({ ...edit, excerpt: e.target.value })} /></Field>
            <Field label="Основной текст" full><textarea rows={7} className="narrativ-input resize-y" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></Field>
            <Field label="Видео (необязательно)" full><input className="narrativ-input" value={edit.videoUrl ?? ""} onChange={(e) => setEdit({ ...edit, videoUrl: e.target.value })} placeholder="https://…" /></Field>
          </div>
          <SaveRow onSave={() => save(edit)} onCancel={() => setEdit(null)} />
        </Modal>
      )}
    </PageSection>
  );
}

/* ─────────────────── COLLECTORS (works) ─────────────────── */
function CollectorsTab() {
  const { works, saveWork, deleteWork, texts, updateText } = useGallery();
  const [edit, setEdit] = useState<Work | null>(null);
  const [intro, setIntro] = useState(texts.collectorsIntro);
  const [payment, setPayment] = useState(texts.payment);

  async function save(w: Work) {
    await saveWork(w);
    setEdit(null);
  }
  async function remove(id: string) { if (confirm("Удалить работу?")) await deleteWork(id); }
  function add() {
    setEdit({
      id: generateUUID(), slug: `work-${Date.now()}`,
      title: "", author: "", year: "", technique: "", size: "",
      price: 0, genre: "painting", image: "", featured: false, description: "",
    });
  }

  async function saveTexts() {
    await Promise.all([
      updateText("collectorsIntro", intro),
      updateText("payment", payment),
    ]);
    alert("Тексты сохранены");
  }

  return (
    <PageSection
      title="Страница «Коллекционерам»"
      pageHref="//collectors"
      description="Каталог работ на продажу, вступительный текст и условия оплаты/доставки."
    >
      <div className="space-y-6 max-w-3xl mb-10">
        <Field label="Вступительный текст раздела «Коллекционерам»">
          <textarea rows={4} className="narrativ-input resize-y" value={intro} onChange={(e) => setIntro(e.target.value)} />
        </Field>
        <Field label="Оплата и доставка (страница /payment)">
          <textarea rows={6} className="narrativ-input resize-y" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </Field>
        <SaveRow
          onSave={saveTexts}
          onCancel={() => { setIntro(texts.collectorsIntro); setPayment(texts.payment); }}
        />
      </div>

      <SubHeader
        title="Работы каталога"
        count={works.length}
        action={<button className="narrativ-btn" onClick={add}>+ Добавить работу</button>}
      />
      <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)]">
        {works.map((w) => (
          <div key={w.id} className="flex items-center gap-4 p-3">
            <div className="w-16 h-16 bg-[#f5f5f5] overflow-hidden shrink-0">
              {w.image && <img src={w.image} alt={w.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="narrativ-serif text-lg truncate">{w.title || <i className="text-[var(--n-mute)]">Без названия</i>}</div>
              <div className="text-xs text-[var(--n-mute)] truncate">{w.author} · {w.year} · {w.technique}</div>
            </div>
            <div className="text-sm hidden sm:block">{formatPrice(w.price)}</div>
            {w.featured && <span className="text-[10px] px-2 py-0.5 bg-[var(--n-gold)] text-white uppercase tracking-wider">На главной</span>}
            <button className="text-sm narrativ-link-underline" onClick={() => setEdit(w)}>Изм.</button>
            <button className="text-sm text-red-600 hover:underline" onClick={() => remove(w.id)}>Удалить</button>
          </div>
        ))}
      </div>
      {edit && <WorkForm value={edit} onSave={save} onClose={() => setEdit(null)} />}
    </PageSection>
  );
}

function WorkForm({ value, onSave, onClose }: { value: Work; onSave: (w: Work) => void; onClose: () => void }) {
  const [w, setW] = useState<Work>(value);
  return (
    <Modal onClose={onClose} title="Работа">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Название"><input className="narrativ-input" value={w.title} onChange={(e) => setW({ ...w, title: e.target.value })} /></Field>
        <Field label="Автор"><input className="narrativ-input" value={w.author} onChange={(e) => setW({ ...w, author: e.target.value })} /></Field>
        <Field label="Год"><input className="narrativ-input" value={w.year} onChange={(e) => setW({ ...w, year: e.target.value })} /></Field>
        <Field label="Техника"><input className="narrativ-input" value={w.technique} onChange={(e) => setW({ ...w, technique: e.target.value })} /></Field>
        <Field label="Размер"><input className="narrativ-input" value={w.size} onChange={(e) => setW({ ...w, size: e.target.value })} /></Field>
        <Field label="Цена, ₽"><input type="number" className="narrativ-input" value={w.price} onChange={(e) => setW({ ...w, price: Number(e.target.value) })} /></Field>
        <Field label="Жанр">
          <select className="narrativ-input" value={w.genre} onChange={(e) => setW({ ...w, genre: e.target.value as Genre })}>
            <option value="painting">Живопись</option>
            <option value="graphic">Графика</option>
            <option value="sculpture">Скульптура</option>
          </select>
        </Field>
        <Field label="Slug (адрес)"><input className="narrativ-input" value={w.slug} onChange={(e) => setW({ ...w, slug: e.target.value })} /></Field>
        <div className="sm:col-span-2"><ImageField label="Изображение работы" value={w.image} onChange={(v) => setW({ ...w, image: v })} /></div>
        <Field label="Описание" full><textarea rows={3} className="narrativ-input resize-none" value={w.description} onChange={(e) => setW({ ...w, description: e.target.value })} /></Field>
        <label className="flex items-center gap-2 sm:col-span-2 text-sm">
          <input type="checkbox" checked={w.featured} onChange={(e) => setW({ ...w, featured: e.target.checked })} />
          Показывать на главной («Работы месяца»)
        </label>
      </div>
      <SaveRow onSave={() => onSave(w)} onCancel={onClose} />
    </Modal>
  );
}

/* ─────────────────── CONTACTS ─────────────────── */
function ContactsTab() {
  const { texts, updateText } = useGallery();
  const [draft, setDraft] = useState(texts.contacts);
  async function save() {
    await updateText("contacts", draft);
    alert("Сохранено");
  }
  return (
    <PageSection
      title="Страница «Контакты»"
      pageHref="//contacts"
      description="Адрес, телефон, режим работы. Карта справа обновляется автоматически."
    >
      <div className="space-y-6 max-w-3xl">
        <Field label="Текст контактов (адрес, телефон, часы работы)">
          <textarea rows={8} className="narrativ-input resize-y" value={draft} onChange={(e) => setDraft(e.target.value)} />
        </Field>
        <SaveRow
          onSave={save}
          onCancel={() => setDraft(texts.contacts)}
        />
      </div>
    </PageSection>
  );
}

/* ─────────────────── LEADS ─────────────────── */
function LeadsTab() {
  const { leads, deleteLead } = useGallery();
  return (
    <PageSection
      title="Заявки клиентов"
      description="Заявки на работы и мастер-классы, оставленные посетителями сайта."
    >
      {leads.length === 0 ? (
        <div className="text-center py-16 text-[var(--n-mute)]">Заявок пока нет. Оставьте тестовую с карточки любой работы.</div>
      ) : (
        <div className="border border-[var(--n-line)] divide-y divide-[var(--n-line)]">
          {leads.map((l) => (
            <div key={l.id} className="p-4 grid gap-2 md:grid-cols-[1fr_2fr_auto] items-start">
              <div>
                <div className="narrativ-serif text-lg">{l.name}</div>
                <div className="text-xs text-[var(--n-mute)]">{new Date(l.createdAt).toLocaleString("ru-RU")}</div>
                <div className="text-sm mt-1">{l.phone} · {l.email}</div>
              </div>
              <div>
                <div className="text-xs text-[var(--n-mute)] uppercase tracking-wider">Работа</div>
                <div className="text-sm">{l.workTitle}</div>
                {l.message && <div className="text-sm mt-2 text-[var(--n-mute)] italic">«{l.message}»</div>}
              </div>
              <button className="text-sm text-red-600 hover:underline" onClick={() => deleteLead(l.id)}>Удалить</button>
            </div>
          ))}
        </div>
      )}
    </PageSection>
  );
}

/* ─────────────────── SHARED ─────────────────── */
function PageSection({
  title, pageHref, description, children,
}: { title: string; pageHref?: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
        <h2 className="narrativ-serif text-2xl">{title}</h2>
        {pageHref && (
          <a href={pageHref} target="_blank" rel="noreferrer" className="text-sm narrativ-link-underline">
            Открыть страницу на сайте →
          </a>
        )}
      </div>
      {description && <p className="text-sm text-[var(--n-mute)] mb-6 max-w-3xl">{description}</p>}
      {children}
    </div>
  );
}

function SubHeader({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3 mt-4">
      <div>
        <div className="narrativ-eyebrow">{title}</div>
        {typeof count === "number" && <div className="text-xs text-[var(--n-mute)] mt-1">Всего: {count}</div>}
      </div>
      {action}
    </div>
  );
}

function SaveRow({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-3 mt-6 justify-end">
      <button className="narrativ-btn-ghost" onClick={onCancel}>Отмена</button>
      <button className="narrativ-btn" onClick={onSave}>Сохранить</button>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-xs uppercase tracking-wider text-[var(--n-mute)] mb-1.5 font-medium">{label}</div>
      {children}
    </label>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full p-6 md:p-8 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="narrativ-serif text-2xl">{title}</div>
          <button onClick={onClose} className="text-[var(--n-mute)] hover:text-[var(--n-ink)] text-xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  function onFile(f: File) {
    if (f.size > 2 * 1024 * 1024) {
      alert("Файл больше 2 МБ. Уменьшите изображение или используйте ссылку.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === "string") onChange(reader.result); };
    reader.readAsDataURL(f);
  }
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-[var(--n-mute)] mb-1.5 font-medium">{label}</div>
      <div className="flex gap-3 items-start">
        <div className="w-28 h-28 shrink-0 bg-[#f5f5f5] border border-[var(--n-line)] overflow-hidden">
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--n-mute)] text-center px-2">Нет<br/>изображения</div>}
        </div>
        <div className="flex-1 space-y-2">
          <label className="narrativ-btn-ghost inline-block cursor-pointer text-sm">
            📷 Загрузить с компьютера
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }}
            />
          </label>
          <input
            className="narrativ-input"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…или вставьте ссылку https://…"
          />
          {value.startsWith("data:") && (
            <div className="text-xs text-[var(--n-mute)]">
              Загружен файл. <button type="button" onClick={() => onChange("")} className="underline">Удалить</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
