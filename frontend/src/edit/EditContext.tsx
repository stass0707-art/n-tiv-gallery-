import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useGallery } from "../store";

const KEY = "narrativ-gallery:edit-mode";

type Ctx = { isEditing: boolean; toggle: () => void; canEdit: boolean };
const EditCtx = createContext<Ctx | null>(null);

export function EditProvider({ children }: { children: ReactNode }) {
  const { role } = useGallery();
  const canEdit = role === "admin" || role === "editor";
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    try { return localStorage.getItem(KEY) === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem(KEY, isEditing ? "1" : "0"); } catch {}
  }, [isEditing]);
  // Автовыключение, если роль сменилась на гостя
  useEffect(() => { if (!canEdit && isEditing) setIsEditing(false); }, [canEdit, isEditing]);

  const toggle = useCallback(() => setIsEditing((v) => !v), []);
  return <EditCtx.Provider value={{ isEditing: isEditing && canEdit, toggle, canEdit }}>{children}</EditCtx.Provider>;
}

export function useEdit() {
  const c = useContext(EditCtx);
  if (!c) throw new Error("EditProvider missing");
  return c;
}
