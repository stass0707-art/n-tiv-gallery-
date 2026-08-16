import { useGallery } from "../store";
import retroFactoryUrl from "../assets/retro-factory.jpg";
import retroHeroUrl from "../assets/retro-naro-hero.jpg";

export default function RetroArchiveStrip({ variant = "hero" }: { variant?: "hero" | "factory" }) {
  const { theme } = useGallery();
  if (theme !== "retro") return null;
  const src = variant === "factory" ? retroFactoryUrl : retroHeroUrl;
  return (
    <div className="narrativ-archive-strip">
      <img src={src} alt="" />
      <div className="narrativ-archive-strip-text">
        <small>Из архива</small>
        Наро-Фоминск, начало XX века
      </div>
    </div>
  );
}
