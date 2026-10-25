"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PortalLoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка входа");
      }

      router.push("/portal");
      router.refresh();
    } catch (err: any) {
      setLoginError(err.message || "Ошибка входа");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");

    if (regPassword !== regPasswordConfirm) {
      setRegError("Пароли не совпадают");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch("/api/portal/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: regFullName.trim(),
          username: regUsername.trim(),
          phone: regPhone.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      setRegSuccess(true);
      setRegFullName("");
      setRegUsername("");
      setRegPhone("");
      setRegPassword("");
      setRegPasswordConfirm("");
    } catch (err: any) {
      setRegError(err.message || "Ошибка регистрации");
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#FCFCF7] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[#586EFF]/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-[#C7FF32]/10 blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 text-center mb-8">
        <Link href="/" className="inline-block transition-transform hover:scale-105">
          <Image
            src="/images/logo.png"
            alt="AMARAS TOUR"
            width={220}
            height={50}
            className="h-10 w-auto object-contain mx-auto"
            priority
          />
        </Link>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
          ПОРТАЛ КОМАНДЫ AMARAS
        </div>
        <p className="mt-2 text-xs sm:text-sm text-white/60">
          Внутренняя система работы с клиентами и турами
        </p>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#242323]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 rounded-2xl bg-white/5 p-1 mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setRegSuccess(false);
            }}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === "login"
                ? "bg-[#C7FF32] text-[#312F2F] shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Вход в портал
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === "register"
                ? "bg-[#C7FF32] text-[#312F2F] shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            Регистрация
          </button>
        </div>

        {tab === "login" ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-300 leading-relaxed">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Логин
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Логин сотрудника или admin"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none focus:ring-1 focus:ring-[#C7FF32]"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Пароль
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none focus:ring-1 focus:ring-[#C7FF32]"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-6 w-full rounded-full bg-[#C7FF32] py-3.5 text-sm sm:text-base font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/20 hover:bg-[#b8f226] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? "Вход..." : "Войти в портал →"}
            </button>
          </form>
        ) : regSuccess ? (
          /* REGISTRATION SUCCESS NOTICE */
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C7FF32]/20 border border-[#C7FF32]/40 text-2xl text-[#C7FF32]">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">Заявка отправлена на модерацию</h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Ваш аккаунт зарегистрирован. Администратор проверит заявку и предоставит доступ.
              После этого вы сможете войти под своим логином.
            </p>
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setRegSuccess(false);
              }}
              className="w-full rounded-full bg-white/10 border border-white/20 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Перейти ко входу
            </button>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-3.5">
            {regError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-300 leading-relaxed">
                {regError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                Имя и Фамилия сотрудника *
              </label>
              <input
                type="text"
                required
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Например: Армен Саргсян"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                Желаемый логин *
              </label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value.toLowerCase())}
                placeholder="Только латинские буквы, например: armen"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                Телефон / Telegram
              </label>
              <input
                type="text"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+374 ... или @username"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                Пароль (минимум 6 символов) *
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
                Повторите пароль *
              </label>
              <input
                type="password"
                required
                value={regPasswordConfirm}
                onChange={(e) => setRegPasswordConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-white/40 focus:border-[#C7FF32] focus:outline-none"
              />
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed pt-1">
              * После отправки формы учетная запись должна быть активирована администратором Amaras
              Tour.
            </p>

            <button
              type="submit"
              disabled={regLoading}
              className="mt-4 w-full rounded-full bg-[#586EFF] py-3.5 text-sm sm:text-base font-bold uppercase tracking-wider text-white shadow-lg shadow-[#586EFF]/20 hover:bg-[#475be6] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {regLoading ? "Отправка..." : "Зарегистрироваться →"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-white/40">
        <Link href="/" className="hover:text-white transition-colors">
          ← Вернуться на главную страницу сайта
        </Link>
      </div>
    </div>
  );
}
