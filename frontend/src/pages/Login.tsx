import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useGallery } from "../store";

export default function Login() {
  const { login, role } = useGallery();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Введите email и пароль");
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast.success("Добро пожаловать в админку");
      navigate("/admin");
    } else {
      toast.error("Неверный email или пароль");
    }
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16 md:py-24">
      <div className="narrativ-eyebrow mb-4">Вход для администратора</div>
      <h1 className="narrativ-serif text-4xl md:text-5xl mb-3">Админка галереи</h1>
      <p className="text-[var(--n-mute)] leading-relaxed mb-8">
        Введите email и пароль, выданные администратором сайта.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@narrativ.art"
            className="narrativ-input w-full"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="narrativ-input w-full"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading} className="narrativ-btn w-full">
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>

      <p className="mt-6 text-xs text-[var(--n-mute)]">
        {role === "guest" ? "Вы не авторизованы." : "Вы уже авторизованы."} При проблемах со входом обратитесь к разработчику.
      </p>
    </section>
  );
}
