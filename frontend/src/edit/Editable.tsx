import { useEffect, useId, useRef, useState, type ElementType, type KeyboardEvent, type MouseEvent } from "react";
import { useEdit } from "./EditContext";

/* ─────────── Текст ─────────── */
type TextProps = {
  value: string;
  onSave: (v: string) => void;
  as?: ElementType;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

export function EditableText({
  value, onSave, as: Tag = "span", className = "", multiline = false, placeholder = "Пусто — кликните, чтобы ввести",
}: TextProps) {
  const { isEditing } = useEdit();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (editing && ref.current) { ref.current.focus(); ref.current.select(); autoSize(ref.current); }
  }, [editing]);

  if (!isEditing) {
    return <Tag className={`${className} ${multiline ? "whitespace-pre-line" : ""}`}>{value}</Tag>;
  }

  function start(e: MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    setDraft(value); setEditing(true);
  }
  function commit() { onSave(draft); setEditing(false); }
  function cancel() { setEditing(false); }
  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !multiline && !e.shiftKey) { e.preventDefault(); commit(); }
    else if (e.key === "Escape") { e.preventDefault(); cancel(); }
    else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit(); }
  }

  if (editing) {
    return (
      <Tag className={`${className} forest-edit-active`}>
        <textarea
          ref={ref}
          value={draft}
          onChange={(e) => { setDraft(e.target.value); autoSize(e.target); }}
          onBlur={commit}
          onKeyDown={onKey}
          rows={1}
          className="forest-edit-textarea"
          style={{ font: "inherit", color: "inherit", letterSpacing: "inherit", lineHeight: "inherit", textAlign: "inherit" as const }}
        />
      </Tag>
    );
  }

  return (
    <Tag
      className={`${className} forest-edit-hover ${multiline ? "whitespace-pre-line" : ""}`}
      onClick={start}
      title="Кликните, чтобы изменить"
    >
      {value || <span className="opacity-50">{placeholder}</span>}
    </Tag>
  );
}

/* ─────────── Картинка ─────────── */
type ImgProps = {
  value: string;
  onSave: (v: string) => void;
  alt?: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
};

export function EditableImage({ value, onSave, alt = "", className = "", imgClassName = "w-full h-full object-cover", loading }: ImgProps) {
  const { isEditing } = useEdit();
  const inputId = useId();

  function onFile(file: File) {
    const r = new FileReader();
    r.onload = () => { if (typeof r.result === "string") onSave(r.result); };
    r.readAsDataURL(file);
  }

  if (!isEditing) {
    return <img src={value} alt={alt} className={`${imgClassName} ${className}`} loading={loading} />;
  }

  return (
    <label className={`forest-edit-img-wrap ${className}`} htmlFor={inputId}>
      <img src={value} alt={alt} className={imgClassName} />
      <div className="forest-edit-img-overlay">
        <span>📷 Заменить фото</span>
      </div>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function autoSize(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}
