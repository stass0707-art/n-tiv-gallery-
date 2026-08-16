import { useEdit } from "./EditContext";

export default function EditBar() {
  const { isEditing, toggle, canEdit } = useEdit();
  if (!canEdit) return null;
  return (
    <div className="forest-edit-bar">
      {isEditing && (
        <div className="forest-edit-hint">
          Режим редактирования: кликните на любой заголовок, описание, цену или фото — измените на месте. Сохраняется автоматически.
        </div>
      )}
      <button onClick={toggle} className={`forest-edit-toggle ${isEditing ? "is-on" : ""}`}>
        {isEditing ? "✓ Готово" : "✏️ Редактировать сайт"}
      </button>
    </div>
  );
}
