import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useGallery, type NarrativTheme } from "./store";
import { EditProvider } from "./edit/EditContext";
import EditBar from "./edit/EditBar";
import CollectionDrawer from "./components/CollectionDrawer";
import logoUrl from "./assets/logo.png";
import silkDrapeUrl from "./assets/silk-blue-drape.jpg";
import silkPatternUrl from "./assets/silk-pattern.jpg";
import retroHeroUrl from "./assets/retro-naro-hero.jpg";
import retroFactoryUrl from "./assets/retro-factory.jpg";



const THEME_OPTIONS: { value: NarrativTheme; label: string; hint: string }[] = [
  { value: "dark", label: "Классика", hint: "Тёмная. Антикварный салон" },
  { value: "retro", label: "Хроника", hint: "Сепия. Архив Наро-Фоминска" },
  { value: "silk", label: "Шёлк", hint: "Отсылка к шёлкоткацкой фабрике" },
];

function ThemeSwitcher({ className = "hidden md:inline-flex" }: { className?: string }) {
  const { theme, setTheme } = useGallery();
  return (
    <div className={`narrativ-theme-switch ${className}`} role="group" aria-label="Тема оформления">
      {THEME_OPTIONS.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`narrativ-theme-switch-btn ${theme === t.value ? "is-active" : ""}`}
          title={t.hint}
          aria-pressed={theme === t.value}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

const NAV = [
  { to: "about", label: "О нас" },
  { to: "characters", label: "Персонажи" },
  { to: "events", label: "События" },
  { to: "talks", label: "Разговоры об искусстве" },
  { to: "collectors", label: "Коллекционерам" },
  { to: "contacts", label: "Контакты" },
];

function CartButton() {
  const { collection, openCollection } = useGallery();
  return (
    <button
      onClick={openCollection}
      className="relative inline-flex items-center gap-2 border border-[var(--n-gold)] px-3 py-2 hover:bg-[var(--n-gold)] hover:text-[#141210] transition-colors"
      style={{ color: "var(--n-gold)" }}
      title="Отложено в коллекцию"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <span className="hidden sm:inline text-[11px] uppercase tracking-[0.18em]">В коллекцию</span>
      {collection.length > 0 && <span className="narrativ-cart-badge">{collection.length}</span>}
    </button>
  );
}

function Header() {
  const { role, logout, name, leads } = useGallery();
  const navigate = useNavigate();
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      setHidden(total - scrolled < 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  return (
    <header className={`narrativ-header-fixed narrativ-dark-band ${hidden ? "is-hidden" : ""}`}>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-6">
        <Link to="/" className="narrativ-logo-plain shrink-0 group">
          <img src={logoUrl} alt="Нарратив" className="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
          <span className="narrativ-serif narrativ-logo-word narrativ-logo-word-responsive">НАРРАТИВ</span>
        </Link>
        <nav className="hidden xl:flex items-center gap-1 ml-6 text-[13px] font-semibold">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={`/${n.to}`}
              className={({ isActive }) => `narrativ-nav-link uppercase tracking-[0.14em] ${isActive ? "is-active" : ""}`}
            >
              <span className="narrativ-nav-link-text">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-3 text-xs">
          <ThemeSwitcher />
          <CartButton />
          {(role === "admin" || role === "editor") && (
            <Link
              to="/admin"
              className="hidden md:inline narrativ-link-underline"
              style={{ color: "var(--n-gold)" }}
            >
              Админка {leads.length > 0 && <span className="ml-1">· {leads.length}</span>}
            </Link>
          )}
          {role === "guest" ? (
            <button
              onClick={() => navigate("/admin/login")}
              className="hidden md:inline border px-2 py-1.5 uppercase tracking-[0.12em] text-[10px]"
              style={{ borderColor: "rgba(197,160,89,0.35)", color: "#F4F1EA" }}
            >
              Вход
            </button>
          ) : (
            <button
              onClick={async () => { await logout(); navigate("/"); }}
              className="hidden md:inline border px-2 py-1.5 uppercase tracking-[0.12em] text-[10px]"
              style={{ borderColor: "rgba(197,160,89,0.35)", color: "#F4F1EA" }}
            >
              {name || "Выйти"}
            </button>
          )}
          {/* Burger — только на мобильных/планшетах */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="xl:hidden narrativ-burger"
            aria-label="Меню"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
      {/* Горизонтальный ряд навигации — только на планшете (md..xl) */}
      <div className="hidden md:block xl:hidden border-t overflow-x-auto" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
        <nav className="flex items-center gap-5 px-6 py-3 text-xs font-medium whitespace-nowrap uppercase tracking-[0.14em]">
          {NAV.map((n) => (
            <NavLink
              key={n.label}
              to={`/${n.to}`}
              className={({ isActive }) => isActive ? "text-[var(--n-gold)]" : "text-[rgba(244,241,234,0.7)]"}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Мобильное выпадающее меню */}
      {menuOpen && (
        <div className="xl:hidden narrativ-mobile-menu">
          <div className="px-5 py-5 flex flex-col gap-1">
            <div className="mb-3">
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">Тема оформления</div>
              <ThemeSwitcher className="inline-flex flex-wrap" />
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-2 mb-1">Разделы</div>
            {NAV.map((n) => (
              <NavLink
                key={n.label}
                to={`/${n.to}`}
                className={({ isActive }) =>
                  `px-3 py-2.5 text-sm uppercase tracking-[0.14em] ${isActive ? "text-[var(--n-gold)]" : "text-[rgba(244,241,234,0.85)]"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
              {role === "guest" ? (
                <Link to="/admin/login" className="text-xs narrativ-link-underline" style={{ color: "var(--n-gold)" }}>
                  Вход для администратора
                </Link>
              ) : (
                <>
                  <Link to="/admin" className="text-xs narrativ-link-underline" style={{ color: "var(--n-gold)" }}>
                    Админка{leads.length > 0 ? ` · ${leads.length}` : ""}
                  </Link>
                  <button
                    onClick={async () => { await logout(); navigate("/"); }}
                    className="text-xs"
                    style={{ color: "rgba(244,241,234,0.55)" }}
                  >
                    Выйти
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) { toast.error("Укажите корректный email"); return; }
    toast.success("Спасибо! Вы подписаны на анонсы");
    setEmail("");
  }
  return (
    <form onSubmit={submit} className="flex gap-2 mt-3">
      <input
        type="email"
        placeholder="Ваш email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-3 py-2.5 text-sm"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(197,160,89,0.3)", color: "#F4F1EA" }}
      />
      <button className="px-4 py-2.5 text-xs uppercase tracking-[0.16em] font-semibold" style={{ background: "var(--n-gold)", color: "#141210" }}>
        Подписаться
      </button>
    </form>
  );
}

const SOCIALS = [
  { label: "VK", href: "https://vk.com/", icon: "V" },
  { label: "Telegram", href: "https://t.me/", icon: "T" },
  { label: "MAX", href: "#", icon: "M" },
  { label: "Instagram*", href: "#", icon: "I" },
];

function Footer() {
  return (
    <footer className="narrativ-dark-band mt-24">
      <div className="max-w-[1400px] mx-auto px-6 py-14 grid gap-10 md:grid-cols-4 items-start">
        <div className="md:col-span-1">
          <div className="narrativ-footer-logo">
            <img src={logoUrl} alt="Нарратив" className="h-10 w-10 object-contain" />
            <span className="narrativ-serif" style={{ color: "var(--n-gold)", fontSize: "1.6rem", letterSpacing: "0.06em" }}>НАРРАТИВ</span>
          </div>
          <p className="narrativ-footer-text mt-5">
            Арт-центр в Наро-Фоминске. Выставки, мастер-классы, встречи с художниками.
          </p>
        </div>
        <div>
          <div className="narrativ-footer-heading">Разделы</div>
          <ul className="narrativ-footer-list">
            {NAV.map((n) => (
              <li key={n.label}>
                <Link to={`/${n.to}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="narrativ-footer-heading">Контакты</div>
          <p className="narrativ-footer-text">
            г. Наро-Фоминск, пл. Свободы, д. 4, к. 1<br />
            ЖК «Воскресенский», вход со стороны набережной<br />
            8 (915) 198-66-01<br />
            narrativ_centre@mail.ru
          </p>
          <div className="flex gap-2 mt-4">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.label} className="narrativ-social">
                <span className="text-sm font-semibold">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="narrativ-footer-heading">Анонсы</div>
          <p className="narrativ-footer-text">Раз в месяц — о новых выставках и мастер-классах.</p>
          <NewsletterForm />
          <p className="narrativ-footer-text mt-4" style={{ fontSize: "0.85rem" }}>
            Демо-макет от studio.lichat.ru · Telegram:{" "}
            <a href="https://t.me/Stan197" target="_blank" rel="noreferrer" style={{ color: "var(--n-gold)", borderBottom: "1px solid currentColor" }}>@Stan197</a>
          </p>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "rgba(197,160,89,0.15)" }}>
        <div className="max-w-[1400px] mx-auto px-6 py-4 text-xs" style={{ color: "rgba(244,241,234,0.5)" }}>
          © {new Date().getFullYear()} Арт-центр «Нарратив». Работы на прототипе — из открытых собраний музеев (public domain).
          <span className="ml-3 opacity-60">* Meta, признана экстремистской и запрещена в РФ.</span>
        </div>
      </div>
    </footer>
  );
}

function Inner() {
  const loc = useLocation();
  const { theme } = useGallery();
  const themeStyle = {
    "--n-silk-drape": `url(${silkDrapeUrl})`,
    "--n-silk-pattern": `url(${silkPatternUrl})`,
    "--n-retro-hero": `url(${retroHeroUrl})`,
    "--n-retro-factory": `url(${retroFactoryUrl})`,
  } as React.CSSProperties;
  const pageName = (loc.pathname.split("/")[1] || "home").toLowerCase();
  return (
    <EditProvider>
      <div
        className="narrativ-shell narrativ-shell-fixed-header"
        data-theme={theme}
        style={themeStyle}
      >
        <Header />
        <main key={loc.pathname} data-page={pageName}>
          <Outlet />
        </main>
        <Footer />
        <EditBar />
        <CollectionDrawer />
        <Toaster theme={theme === "retro" ? "light" : "dark"} position="top-center" />
      </div>
    </EditProvider>
  );
}

export default function GalleryLayout() {
  return <Inner />;
}
