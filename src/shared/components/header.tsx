"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const brand = { primary: "#38bdf8", accent: "#93c5fd" };

/* ----------------- Language Switcher (next-intl) ----------------- */
function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const locales = ["ru", "kk", "en"] as const;

  function changeLocale(next: (typeof locales)[number]) {
    // убираем текущий префикс локали и подставляем новый
    const stripped = pathname.replace(/^\/(ru|kk|en)(?=\/|$)/, "").replace(/^\/?/, "/");
    router.replace(`/${next}${stripped}`);
  }

  return (
    <div className="relative">
      <details className="group">
        <summary className="list-none inline-flex h-9 w-12 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white/60 text-sm shadow-sm backdrop-blur hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/80">
          {locale.toUpperCase()}
        </summary>
        <div className="absolute right-0 mt-2 rounded-xl border border-black/10 bg-white/90 backdrop-blur shadow-lg dark:border-white/10 dark:bg-neutral-900/90">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => changeLocale(l)}
              className={`block w-full px-4 py-2 text-left text-sm rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${
                locale === l ? "font-semibold text-sky-600 dark:text-sky-300" : ""
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

/* ----------------- Theme Toggle ----------------- */
export function ThemeToggle() {
  const t = useTranslations("theme");
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? saved === "dark" : prefers;
    setDark(useDark);
    document.documentElement.classList.toggle("dark", useDark);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("toLight") : t("toDark")}
      aria-pressed={dark}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white/60 shadow-sm backdrop-blur hover:bg-white/80 text-neutral-900 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
    >
      {!mounted ? (
        <span className="sr-only">Theme</span>
      ) : dark ? (
        // Луна (темная)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 1 0 21 12.79z" />
        </svg>
      ) : (
        // Солнце (светлая)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.76 4.84 5.34 3.42 3.92 4.84l1.42 1.42 1.42-1.42ZM1 13h3v-2H1v2Zm10 10h2v-3h-2v3Zm9.08-18.16-1.42-1.42-1.42 1.42 1.42 1.42 1.42-1.42ZM17.24 19.16l1.42 1.42 1.42-1.42-1.42-1.42-1.42 1.42ZM20 11v2h3v-2h-3ZM4.84 17.24l-1.42 1.42 1.42 1.42 1.42-1.42-1.42-1.42ZM11 1v3h2V1h-2Zm1 6a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7Z" />
        </svg>
      )}
    </button>
  );
}

/* ----------------- Header ----------------- */
export default function Header({ user }: { user?: { name: string; points: number } | null }) {
  const tBrand = useTranslations();
  const tNav = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const tUser = useTranslations("user");
  const locale = useLocale();
  const pathname = usePathname();
  const isLogged = !!user;
  
  // Скрываем переключатель языков на главной странице
  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;

  // Хелпер для локализованных ссылок
  const H = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link className="hover:text-neutral-900 dark:hover:text-white" href={`/${locale}${href}`}>
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-black/10 bg-white/70 dark:border-white/10 dark:bg-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Лого + рейтинг */}
        <div className="flex items-center gap-4">
          <H href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl" style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})` }} />
              <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                {tBrand("brand")}
              </span>
            </div>
          </H>

          {isLogged && (
            <div className="hidden md:flex items-center gap-2 rounded-xl border px-3 py-1 text-xs text-neutral-700 border-black/10 bg-white/60 dark:text-white/80 dark:bg-white/5 dark:border-white/10">
              <span>{tUser("rating")}</span>
              <span className="text-sky-600 dark:text-sky-300 font-semibold">{user!.points}</span>
            </div>
          )}
        </div>

        {/* Навигация */}
        <nav className="hidden gap-6 text-sm text-neutral-700 md:flex dark:text-white/80">
          <H href="/">{tNav("home")}</H>
          <H href="/courses">{tNav("courses")}</H>
          <H href="/materials">{tNav("materials")}</H>
        </nav>

        {/* Правая панель */}
        <div className="flex items-center gap-3">
          {!isHomePage && <LanguageSwitcher />}
          <ThemeToggle />

          {!isLogged ? (
            <div className="flex items-center gap-3 text-sm">
              <H href="/auth">{tAuth("login")}</H>
              <Link
                href={`/${locale}/auth`}
                className="rounded-xl bg-sky-500 text-white px-4 py-2 font-medium hover:bg-sky-400 transition dark:bg-sky-400 dark:text-neutral-950 dark:hover:bg-sky-300"
              >
                {tAuth("signup")}
              </Link>
            </div>
          ) : (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition border-black/10 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <span className="text-neutral-800 dark:text-white">{user!.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-neutral-600 dark:fill-white/70" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block min-w-[180px] rounded-xl border p-2 text-sm shadow-xl border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-neutral-900/90">
                <H href="/profile">{tUser("profile")}</H>
                <H href="/settings">{tUser("settings")}</H>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 text-red-600 dark:text-red-300 dark:hover:bg-white/5">
                  {tUser("logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
