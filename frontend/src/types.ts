export type Role = "guest" | "editor" | "admin";

export type Genre = "painting" | "graphic" | "sculpture";

export type Work = {
  id: string;
  slug: string;
  title: string;
  author: string;
  year: string;
  technique: string;
  size: string;
  price: number;
  genre: Genre;
  image: string;
  featured: boolean;
  description: string;
  authorBio?: string;
  available?: boolean;
};

export type EventStatus = "current" | "past";

export type GalleryEvent = {
  id: string;
  title: string;
  date: string;
  cover: string;
  description: string;
  status: EventStatus;
};

export type Workshop = {
  id: string;
  title: string;
  date: string;
  teacher: string;
  price: number;
  cover: string;
  description: string;
};

export type Lead = {
  id: string;
  workId: string;
  workTitle: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: number;
};

export type PageTexts = {
  about: string;
  payment: string;
  contacts: string;
  aboutHero: string;
  collectorsIntro: string;
};

export type Character = {
  id: string;
  name: string;
  role: string;
  bio: string;
  thumb: string;
  videoUrl?: string;
};

export type PostCategory = "news" | "character";

export type Post = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  body: string;
  cover: string;
  category: PostCategory;
  characterId?: string;
  videoUrl?: string;
};

export type ExhibitionType = "exhibition" | "masterclass" | "competition";

export type Exhibition = {
  id: string;
  title: string;
  date: string;
  cover: string;
  concept: string;
  type: ExhibitionType;
  participants: string[]; // имена авторов, могут совпадать с Work.author
  photos: string[];
  thematic: string; // произвольный текст «Тематика»
};
