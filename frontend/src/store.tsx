import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Role, Work, GalleryEvent, Workshop, Lead, PageTexts, Character, Post, Exhibition } from "./types";
import { SEED_WORKS, SEED_EVENTS, SEED_WORKSHOPS, SEED_TEXTS, SEED_CHARACTERS, SEED_POSTS, SEED_EXHIBITIONS } from "./data";

const THEME_KEY = "narrativ-gallery:theme";
const NAME_KEY = "narrativ-gallery:name";

export type NarrativTheme = "dark" | "retro" | "silk";

type State = {
  works: Work[];
  events: GalleryEvent[];
  workshops: Workshop[];
  leads: Lead[];
  texts: PageTexts;
  characters: Character[];
  posts: Post[];
  exhibitions: Exhibition[];
  collection: string[];
};

const SEED: State = {
  works: SEED_WORKS,
  events: SEED_EVENTS,
  workshops: SEED_WORKSHOPS,
  leads: [],
  texts: SEED_TEXTS,
  characters: SEED_CHARACTERS,
  posts: SEED_POSTS,
  exhibitions: SEED_EXHIBITIONS,
  collection: [],
};

type Ctx = State & {
  setWorks: (w: Work[]) => void;
  setEvents: (e: GalleryEvent[]) => void;
  setWorkshops: (w: Workshop[]) => void;
  setCharacters: (c: Character[]) => void;
  setPosts: (p: Post[]) => void;
  setExhibitions: (e: Exhibition[]) => void;
  addLead: (l: Omit<Lead, "id" | "createdAt">) => Promise<boolean>;
  deleteLead: (id: string) => void;
  setTexts: (t: PageTexts) => void;
  updateWork: (id: string, patch: Partial<Work>) => void;
  updateEvent: (id: string, patch: Partial<GalleryEvent>) => void;
  updateWorkshop: (id: string, patch: Partial<Workshop>) => void;
  updateCharacter: (id: string, patch: Partial<Character>) => void;
  updatePost: (id: string, patch: Partial<Post>) => void;
  updateExhibition: (id: string, patch: Partial<Exhibition>) => void;
  updateText: (key: keyof PageTexts, value: string) => void;
  saveWork: (w: Work) => Promise<Work>;
  deleteWork: (id: string) => Promise<void>;
  saveEvent: (e: GalleryEvent) => Promise<GalleryEvent>;
  deleteEvent: (id: string) => Promise<void>;
  saveWorkshop: (w: Workshop) => Promise<Workshop>;
  deleteWorkshop: (id: string) => Promise<void>;
  saveCharacter: (c: Character) => Promise<Character>;
  deleteCharacter: (id: string) => Promise<void>;
  savePost: (p: Post) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  saveExhibition: (e: Exhibition) => Promise<Exhibition>;
  deleteExhibition: (id: string) => Promise<void>;
  addToCollection: (workId: string) => void;
  removeFromCollection: (workId: string) => void;
  clearCollection: () => void;
  collectionOpen: boolean;
  openCollection: () => void;
  closeCollection: () => void;
  role: Role;
  setRole: (r: Role) => void;
  name: string;
  setName: (n: string) => void;
  theme: NarrativTheme;
  setTheme: (t: NarrativTheme) => void;
  resetDemo: () => void;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const GalleryCtx = createContext<Ctx | null>(null);

const API = "/api";

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(SEED);
  const [loading, setLoading] = useState(true);
  const [role, setRoleState] = useState<Role>("guest");
  const [name, setNameState] = useState<string>(() => localStorage.getItem(NAME_KEY) || "");
  const [theme, setThemeState] = useState<NarrativTheme>(
    () => ((localStorage.getItem(THEME_KEY) as NarrativTheme) || "dark")
  );
  const [collectionOpen, setCollectionOpen] = useState(false);

  // Load public data from API on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [works, exhibitions, events, workshops, characters, posts, texts] = await Promise.all([
          apiFetch(`${API}/works`),
          apiFetch(`${API}/exhibitions`),
          apiFetch(`${API}/events`),
          apiFetch(`${API}/workshops`),
          apiFetch(`${API}/characters`),
          apiFetch(`${API}/posts`),
          apiFetch(`${API}/texts`),
        ]);
        if (cancelled) return;
        setState((s) => ({
          ...s,
          works: works.length ? works : s.works,
          exhibitions: exhibitions.length ? exhibitions : s.exhibitions,
          events: events.length ? events : s.events,
          workshops: workshops.length ? workshops : s.workshops,
          characters: characters.length ? characters : s.characters,
          posts: posts.length ? posts : s.posts,
          texts: texts && Object.keys(texts).length ? texts : s.texts,
        }));
      } catch (err) {
        console.error("Failed to load gallery data", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Check auth session and load leads
  useEffect(() => {
    apiFetch(`${API}/auth/me`).then((data) => {
      if (data.user) {
        setRoleState(data.user.role as Role);
        if (data.user.role === "admin" || data.user.role === "editor") {
          apiFetch(`${API}/admin/leads`).then((leads) => {
            setState((s) => ({ ...s, leads }));
          }).catch(() => {});
        }
      }
    }).catch(() => {});
  }, []);

  const setWorks = (works: Work[]) => setState((s) => ({ ...s, works }));
  const setEvents = (events: GalleryEvent[]) => setState((s) => ({ ...s, events }));
  const setWorkshops = (workshops: Workshop[]) => setState((s) => ({ ...s, workshops }));
  const setCharacters = (characters: Character[]) => setState((s) => ({ ...s, characters }));
  const setPosts = (posts: Post[]) => setState((s) => ({ ...s, posts }));
  const setExhibitions = (exhibitions: Exhibition[]) => setState((s) => ({ ...s, exhibitions }));
  const setTexts = (texts: PageTexts) => setState((s) => ({ ...s, texts }));

  const updateEntity = async (entity: string, id: string, patch: object) => {
    const updated = await apiFetch(`${API}/admin/${entity}/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
    const key = entity === "exhibitions" ? "exhibitions" : entity as keyof State;
    const arr = (state[key] as any[]) || [];
    setState((s) => ({ ...s, [key]: arr.map((x: any) => x.id === id ? { ...x, ...updated } : x) }));
    return updated;
  };

  const updateWork = (id: string, patch: Partial<Work>) => updateEntity("works", id, patch);
  const updateEvent = (id: string, patch: Partial<GalleryEvent>) => updateEntity("events", id, patch);
  const updateWorkshop = (id: string, patch: Partial<Workshop>) => updateEntity("workshops", id, patch);
  const updateCharacter = (id: string, patch: Partial<Character>) => updateEntity("characters", id, patch);
  const updatePost = (id: string, patch: Partial<Post>) => updateEntity("posts", id, patch);
  const updateExhibition = (id: string, patch: Partial<Exhibition>) => updateEntity("exhibitions", id, patch);

  const updateText = async (key: keyof PageTexts, value: string) => {
    await apiFetch(`${API}/admin/texts`, {
      method: "PUT",
      body: JSON.stringify({ [key]: value }),
    });
    setState((s) => ({ ...s, texts: { ...s.texts, [key]: value } }));
  };

  async function saveEntity<T extends { id: string }>(entity: string, item: T): Promise<T> {
    const exists = state[entity as keyof State] && (state[entity as keyof State] as any[]).some((x: any) => x.id === item.id);
    if (exists) {
      const updated = await apiFetch(`${API}/admin/${entity}/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });
      setState((s) => {
        const arr = (s[entity as keyof State] as any[]) || [];
        return { ...s, [entity]: arr.map((x: any) => x.id === item.id ? { ...x, ...updated } : x) };
      });
      return updated;
    } else {
      const created = await apiFetch(`${API}/admin/${entity}`, {
        method: "POST",
        body: JSON.stringify(item),
      });
      setState((s) => {
        const arr = (s[entity as keyof State] as any[]) || [];
        return { ...s, [entity]: [created, ...arr] };
      });
      return created;
    }
  }

  async function deleteEntity(entity: string, id: string) {
    await apiFetch(`${API}/admin/${entity}/${id}`, { method: "DELETE" });
    setState((s) => {
      const arr = (s[entity as keyof State] as any[]) || [];
      return { ...s, [entity]: arr.filter((x: any) => x.id !== id) };
    });
  }

  const saveWork = (w: Work) => saveEntity("works", w);
  const deleteWork = (id: string) => deleteEntity("works", id);
  const saveEvent = (e: GalleryEvent) => saveEntity("events", e);
  const deleteEvent = (id: string) => deleteEntity("events", id);
  const saveWorkshop = (w: Workshop) => saveEntity("workshops", w);
  const deleteWorkshop = (id: string) => deleteEntity("workshops", id);
  const saveCharacter = (c: Character) => saveEntity("characters", c);
  const deleteCharacter = (id: string) => deleteEntity("characters", id);
  const savePost = (p: Post) => saveEntity("posts", p);
  const deletePost = (id: string) => deleteEntity("posts", id);
  const saveExhibition = (e: Exhibition) => saveEntity("exhibitions", e);
  const deleteExhibition = (id: string) => deleteEntity("exhibitions", id);

  const addLead = async (l: Omit<Lead, "id" | "createdAt">) => {
    await apiFetch(`${API}/leads`, {
      method: "POST",
      body: JSON.stringify({
        workId: l.workId,
        workTitle: l.workTitle,
        name: l.name,
        phone: l.phone,
        email: l.email,
        message: l.message,
      }),
    });
    setState((s) => ({
      ...s,
      leads: [{ ...l, id: `l${Date.now()}`, createdAt: Date.now() }, ...s.leads],
    }));
    return true;
  };

  const deleteLead = (id: string) => {
    setState((s) => ({ ...s, leads: s.leads.filter((x) => x.id !== id) }));
  };

  const addToCollection = (workId: string) => {
    setState((s) => s.collection.includes(workId) ? s : { ...s, collection: [...s.collection, workId] });
  };
  const removeFromCollection = (workId: string) => {
    setState((s) => ({ ...s, collection: s.collection.filter((id) => id !== workId) }));
  };
  const clearCollection = () => setState((s) => ({ ...s, collection: [] }));

  const setRole = (r: Role) => {
    setRoleState(r);
  };
  const setName = (n: string) => {
    setNameState(n);
    localStorage.setItem(NAME_KEY, n);
  };
  const setTheme = (t: NarrativTheme) => {
    setThemeState(t);
    try { localStorage.setItem(THEME_KEY, t); } catch {}
  };

  const resetDemo = () => {
    setState(SEED);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch(`${API}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setRoleState(data.user.role as Role);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = async () => {
    await apiFetch(`${API}/auth/logout`, { method: "POST" });
    setRoleState("guest");
  };

  const value = useMemo<Ctx>(() => ({
    ...state,
    setWorks, setEvents, setWorkshops, setCharacters, setPosts, setExhibitions, setTexts,
    updateWork, updateEvent, updateWorkshop, updateCharacter, updatePost, updateExhibition, updateText,
    saveWork, deleteWork, saveEvent, deleteEvent, saveWorkshop, deleteWorkshop,
    saveCharacter, deleteCharacter, savePost, deletePost, saveExhibition, deleteExhibition,
    addLead, deleteLead,
    addToCollection, removeFromCollection, clearCollection,
    collectionOpen,
    openCollection: () => setCollectionOpen(true),
    closeCollection: () => setCollectionOpen(false),
    role, setRole, name, setName, theme, setTheme, resetDemo,
    loading,
    login,
    logout,
  }), [state, collectionOpen, role, name, theme, login, logout]);

  return <GalleryCtx.Provider value={value}>{children}</GalleryCtx.Provider>;
}

export function useGallery() {
  const ctx = useContext(GalleryCtx);
  if (!ctx) throw new Error("GalleryProvider missing");
  return ctx;
}

export function formatPrice(rub: number) {
  return new Intl.NumberFormat("ru-RU").format(rub) + " ₽";
}
