"use client";
import { motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { default as Link, default as NextLink } from "next/link";
import React, { useEffect, useState } from "react";

import type {
  Module,
  UserProgress,
} from "@/modules/learning/schemas/learning.schema";
import { getOverallProgress } from "@/modules/learning/utils/learning.utils";
import {
  getLocalizedModules,
  getUserProgressById,
} from "@/modules/learning/utils/mock-data";
import { getUsers } from "@/shared/lib/mock-auth";

// Один файл: страница-лендинг для обучения казахскому языку.
// Используются только React + framer-motion + Tailwind классы. Никаких внешних компонентов.
// Секции: Навбар, Хиро, Преимущества, Курсы, Рейтинг ТОП-5, Отзывы, CTA, Футер.
// Прокрутка по якорям, плавные анимации, современный минималистичный стиль.
// Редизайн: преобладают светло-голубые оттенки (sky/cyan), аккуратные акценты.

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      ease: [0.42, 0, 0.58, 1],
      duration: 0.6,
    },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.42, 0, 0.58, 1], duration: 0.5 },
  },
};
const shine = {
  initial: { backgroundPosition: "200% 0" },
  animate: {
    backgroundPosition: "-200% 0",
    transition: { repeat: Infinity, duration: 7, ease: "linear" as const },
  },
};

const brand = {
  primary: "#38bdf8",
  secondary: "#22d3ee",
  accent: "#93c5fd",
};

const LOCALES = ["ru", "kk", "en"] as const;
type Locale = (typeof LOCALES)[number];

function stripLeadingLocale(path: string) {
  return path.replace(/^\/(ru|kk|en)(?=\/|$)/, "");
}

function withLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function LocalizedLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const locale = useLocale() as Locale;
  const clean = stripLeadingLocale(withLeadingSlash(href));
  const finalHref = `/${locale}${clean}`;
  return (
    <NextLink href={finalHref} className={className}>
      {children}
    </NextLink>
  );
}

function GlassCard({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-white/5 ${className}`}
    >
      {children}
    </div>
  );
}
function SectionTitle({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
}) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-2xl text-center"
    >
      {eyebrow && (
        <motion.div
          variants={item}
          className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-white/60"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        variants={item}
        className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white"
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          variants={item}
          className="mt-3 text-neutral-700 dark:text-white/70"
        >
          {desc}
        </motion.p>
      )}
    </motion.div>
  );
}

const TopBadge = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs tracking-wide text-neutral-700 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white/90">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-sky-400"
    >
      <path d="M12 2 15 9l7 .5-5.5 4.5L18.5 21 12 17.5 5.5 21l1-7L1 9.5 8 9z" />
    </svg>
    {text}
  </span>
);

/**
 * Интерфейс для данных рейтинга пользователя
 */
interface UserRating {
  id: string;
  name: string;
  points: number;
  completionPercent: number;
  isRealUser: boolean;
}

/**
 * Вычисляет максимальные баллы из всех модулей
 */
const calculateMaxPoints = (modules: Module[]): number => {
  let maxPoints = 0;
  modules.forEach((module) => {
    module.levels.forEach((level) => {
      // Для каждого уровня берем максимальные баллы из taskPool
      // Учитываем, что за уровень показывается tasksPerLevel заданий
      const sortedTasks = [...level.taskPool]
        .sort((a, b) => b.points - a.points)
        .slice(0, level.tasksPerLevel);
      maxPoints += sortedTasks.reduce((sum, task) => sum + task.points, 0);
    });
  });
  return maxPoints;
};

/**
 * Получает прогресс пользователя из localStorage
 */
const getUserProgress = (userId: string): UserProgress | null => {
  return getUserProgressById(userId);
};

/**
 * Создает моковых пользователей с реалистичными данными
 */
const createMockUsers = (
  modules: Module[],
  maxPoints: number
): UserRating[] => {
  const mockNames = [
    "Айжан Нурланова",
    "Ерлан Касымов",
    "Алия Сейтжанова",
    "Данияр Абдуллаев",
    "Амина Жумабекова",
    "Нурлан Токтаров",
    "Сабина Омарова",
    "Асхат Баймуратов",
    "Жанар Калиева",
    "Асылбек Нуртазин",
  ];

  return mockNames.map((name, index) => {
    // Создаем реалистичное распределение прогресса
    // Первые пользователи имеют больше прогресса
    const progressMultiplier = 1 - index * 0.08; // От 100% до ~20%
    const completionPercent = Math.max(
      15,
      Math.min(100, Math.round(progressMultiplier * 100))
    );

    // Баллы пропорциональны проценту завершения, но с небольшими вариациями
    const basePoints = Math.round((maxPoints * completionPercent) / 100);
    const variation = Math.round(basePoints * 0.1 * (Math.random() - 0.5)); // ±10% вариация
    const points = Math.max(0, Math.min(maxPoints, basePoints + variation));

    return {
      id: `mock_user_${index}`,
      name,
      points,
      completionPercent,
      isRealUser: false,
    };
  });
};

/**
 * Получает рейтинг пользователей (реальных + моковых)
 */
const getUserRatings = (): UserRating[] => {
  if (typeof window === "undefined") return [];

  const modules = getLocalizedModules("ru");
  const maxPoints = calculateMaxPoints(modules);

  // Получаем реальных пользователей
  const realUsers = getUsers();
  const realUserRatings: UserRating[] = realUsers
    .map((user) => {
      const progress = getUserProgress(user.id);
      if (!progress) return null;

      const overallProgress = getOverallProgress(modules, progress);
      return {
        id: user.id,
        name: user.name,
        points: progress.totalPoints,
        completionPercent: overallProgress.percent,
        isRealUser: true,
      };
    })
    .filter((rating): rating is UserRating => rating !== null);

  // Создаем моковых пользователей
  const mockUserRatings = createMockUsers(modules, maxPoints);

  // Смешиваем и сортируем по баллам (при равных баллах - по проценту завершения)
  const allRatings = [...realUserRatings, ...mockUserRatings].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.completionPercent - a.completionPercent;
  });

  // Возвращаем топ-10
  return allRatings.slice(0, 10);
};

const features = [
  {
    title: "Уроки по 15 минут",
    desc: "Лаконичные модули и чекпоинты для уверенного прогресса каждый день.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6 fill-sky-400"
      >
        <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9Zm.5-14h-2v6h6v-2h-4Z" />
      </svg>
    ),
  },
  {
    title: "Натаскивание на речь",
    desc: "AI-диалоги: говорите, получайте обратную связь, исправления и подсказки.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6 fill-sky-400"
      >
        <path d="M12 3a9 9 0 0 0-9 9 8.93 8.93 0 0 0 2.64 6.36L3 21l2.64-2.64A8.93 8.93 0 0 0 12 21a9 9 0 0 0 0-18Zm0 16a7 7 0 0 1-4.65-1.77l-.33-.29-1.33 1.33.29.33A8.9 8.9 0 0 0 12 20a8 8 0 1 0-8-8 8.9 8.9 0 0 0 1.4 4.65l.33.29 1.33-1.33-.29-.33A7 7 0 1 1 12 19Zm-1-6h2v-6h-2Zm0 4h2v-2h-2Z" />
      </svg>
    ),
  },
  {
    title: "Качественные материалы",
    desc: "Современные видеоуроки, структурированные материалы и наглядные объяснения.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6 fill-sky-400"
      >
        <path d="M12 12a5 5 0 1 0-5-5 5.006 5.006 0 0 0 5 5Zm0 2c-3.86 0-7 2.14-7 4.78V22h14v-3.22C19 16.14 15.86 14 12 14Z" />
      </svg>
    ),
  },
];

const courses = [
  {
    title: "A1 — База",
    level: "Новички",
    desc: "Алфавит, базовые фразы, произношение и простая грамматика.",
    hours: 24,
  },
  {
    title: "A2 — Повседневный",
    level: "Продолжающие",
    desc: "Сценарии из жизни: покупки, поездки, работа с документами.",
    hours: 36,
  },
  {
    title: "B1 — Уверенная речь",
    level: "Средний",
    desc: "Свободные диалоги, устойчивые конструкции и словарь по темам.",
    hours: 48,
  },
];

const testimonials = [
  {
    name: "Алина",
    role: "HR-менеджер",
    text: "Занятия короткие и динамичные. Через месяц уже спокойно общаюсь с коллегами.",
  },
  {
    name: "Ермек",
    role: "Студент",
    text: "Понравилась практика речи с ИИ и поддержка наставника. Прогресс стабильно ощущается.",
  },
  {
    name: "Мария",
    role: "Маркетолог",
    text: "Классный интерфейс, задания по делу. Рейтинг помог выбрать курс под цель.",
  },
];

export default function Page() {
  const t = useTranslations("landing");
  const [userRatings, setUserRatings] = useState<UserRating[]>([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    role: "",
    text: "",
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    course: courses[0]?.title || "",
  });
  const [reviewMsg, setReviewMsg] = useState("");
  const [signupMsg, setSignupMsg] = useState("");

  const materials = [
    {
      tag: t("materials.0.tag"),
      title: t("materials.0.title"),
      duration: "15 мин",
    },
    {
      tag: t("materials.1.tag"),
      title: t("materials.1.title"),
      duration: "12 мин",
    },
    {
      tag: t("materials.2.tag"),
      title: t("materials.2.title"),
      duration: "18 мин",
    },
    {
      tag: t("materials.3.tag"),
      title: t("materials.3.title"),
      duration: "20 мин",
    },
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMsg("Спасибо за отзыв!");
    setReviewForm({ name: "", role: "", text: "" });
    setTimeout(() => setReviewMsg(""), 3000);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupMsg("Регистрация успешна!");
    setSignupForm({ name: "", email: "", course: courses[0]?.title || "" });
    setTimeout(() => setSignupMsg(""), 3000);
  };

  useEffect(() => {
    setUserRatings(getUserRatings());
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 scroll-smooth dark:bg-neutral-950 dark:text-white">
      {/* Фоны */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${brand.primary} 0%, rgba(34,211,238,0) 70%)`,
          }}
          initial={{ scale: 0.9, opacity: 0.18 }}
          animate={{ scale: 1.05, opacity: 0.35 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/4 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 50%, ${brand.secondary} 0%, rgba(147,197,253,0) 70%)`,
          }}
          initial={{ scale: 0.9, opacity: 0.15 }}
          animate={{ scale: 1.08, opacity: 0.28 }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Навбар */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2">
            <motion.div
              className="h-8 w-8 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})`,
              }}
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
            <span className="text-lg font-semibold tracking-tight">
              Kazakh Learn
            </span>
          </a>
          <nav className="hidden gap-6 text-sm text-white/80 md:flex">
            <a className="hover:text-white" href="#features">
              Преимущества
            </a>
            <a className="hover:text-white" href="#courses">
              Курсы
            </a>
            <a className="hover:text-white" href="#rating">
              Рейтинг
            </a>
            <a className="hover:text-white" href="#reviews">
              Отзывы
            </a>
          </nav>
          <Link
            href="/auth"
            className="rounded-xl bg-sky-400 text-neutral-950 px-4 py-2 text-sm font-medium hover:bg-sky-300 transition"
          >
            Начать
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-20 md:grid-cols-2 md:py-28">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-5"
          >
            <TopBadge text={t("hero.badge")} />
            <motion.h1
              variants={item}
              className="text-4xl md:text-6xl font-semibold leading-[1.1] dark:text-white"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              variants={item}
              className="text-neutral-700 dark:text-white/70"
            >
              {t("hero.text")}
            </motion.p>
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <LocalizedLink
                href="/courses"
                className="rounded-xl bg-sky-400 text-neutral-950 px-5 py-3 text-sm font-medium hover:bg-sky-300 transition"
              >
                {t("hero.ctaPrimary")}
              </LocalizedLink>
              <LocalizedLink
                href="/materials"
                className="rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm hover:bg-white/80 transition dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {t("hero.ctaSecondary")}
              </LocalizedLink>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-6 inline-block rounded-xl border border-black/10 bg-gradient-to-r from-black/10 via-black/5 to-black/10 p-[1px] dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/10"
            >
              <motion.div
                className="rounded-[11px] px-4 py-2 text-xs text-neutral-700 dark:text-white/80"
                style={{
                  backgroundImage: `linear-gradient(120deg, rgba(147,197,253,0.18), rgba(255,255,255,0.04), rgba(56,189,248,0.18))`,
                  backgroundSize: "200% 100%",
                }}
                initial={shine.initial}
                animate={shine.animate}
              >
                {t("hero.metrics")}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Мини-урок */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring", stiffness: 100, damping: 16 }}
          >
            <GlassCard className="relative overflow-hidden">
              <div
                className="absolute -top-10 -right-10 h-40 w-40 rounded-full"
                style={{ background: `${brand.primary}22` }}
              />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-neutral-600 dark:text-white/70">
                    {t("mini.lessonLabel")}
                  </div>
                  <div className="text-xl font-medium">{t("mini.title")}</div>
                </div>
                <div className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs dark:border-white/15 dark:bg-white/10">
                  A1
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">
                    {t("mini.phraseLabel")}
                  </div>
                  <div className="mt-1">{t("mini.phrase.kz")}</div>
                  <div className="text-xs text-neutral-500 dark:text-white/50">
                    {t("mini.phrase.ru")}
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">
                    {t("mini.aiPracticeLabel")}
                  </div>
                  <div className="mt-1">{t("mini.ai.kz")}</div>
                  <div className="text-xs text-neutral-500 dark:text-white/50">
                    {t("mini.ai.ru")}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">
                    {t("mini.quizLabel")}
                  </div>
                  <div className="mt-1 text-sm">{t("mini.quizQuestion")}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {[
                      { t: t("mini.options.0"), ok: true },
                      { t: t("mini.options.1"), ok: false },
                      { t: t("mini.options.2"), ok: false },
                    ].map((o, i) => (
                      <span
                        key={i}
                        className={`rounded-md px-2 py-1 ${
                          o.ok
                            ? "bg-sky-400/20 text-sky-700 dark:text-sky-300"
                            : "bg-black/5 text-neutral-600 dark:bg-white/5 dark:text-white/70"
                        }`}
                      >
                        {o.t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">
                    {t("mini.timeLabel")}
                  </div>
                  <div className="mt-1">04:32</div>
                  <LocalizedLink
                    href="/courses"
                    className="mt-3 inline-block rounded-lg bg-sky-400 px-4 py-2 text-sm text-neutral-950 hover:bg-sky-300"
                  >
                    {t("mini.startLesson")}
                  </LocalizedLink>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 md:py-24">
        <SectionTitle
          eyebrow={t("featuresEyebrow")}
          title={t("featuresTitle")}
          desc={t("featuresDesc")}
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-sky-400/10 p-3 ring-1 ring-inset ring-sky-400/20">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-lg font-medium dark:text-white">
                      {f.title}
                    </div>
                    <p className="mt-1 text-neutral-700 dark:text-white/70">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Материалы */}
      <section className="py-16 md:py-24">
        <SectionTitle
          eyebrow={t("libraryEyebrow")}
          title={t("libraryTitle")}
          desc={t("libraryDesc")}
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-4">
          {materials.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-400/10 ring-1 ring-black/10 dark:ring-white/10">
                    <div className="absolute inset-0 grid place-items-center text-neutral-700 dark:text-white/80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-10 w-10 fill-current"
                      >
                        <path d="M8 5v14l11-7-11-7Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300">
                    <span className="rounded-md border border-sky-400/30 bg-sky-400/10 px-2 py-0.5">
                      {m.tag}
                    </span>
                    <span className="text-neutral-600 dark:text-white/60">
                      {t("video")} • {m.duration}
                    </span>
                  </div>
                  <div className="mt-2 font-medium dark:text-white">
                    {m.title}
                  </div>
                  <LocalizedLink
                    href="/materials"
                    className="mt-3 inline-block w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    {t("open")}
                  </LocalizedLink>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ТОП-5 */}
      <section className="py-16 md:py-24">
        <SectionTitle
          eyebrow={t("gamificationEyebrow")}
          title={t("topTitle")}
          desc={t("topDesc")}
        />
        <div className="mx-auto mt-10 max-w-3xl px-4">
          <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full table-auto divide-y divide-black/10 bg-white/70 dark:divide-white/10 dark:bg-white/5">
              <thead>
                <tr className="text-left text-sm text-neutral-700 dark:text-white/70">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Имя</th>
                  <th className="px-4 py-3">Баллы</th>
                  <th className="px-4 py-3">Прогресс</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userRatings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-white/50"
                    >
                      Загрузка рейтинга...
                    </td>
                  </tr>
                ) : (
                  userRatings.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ delay: i * 0.04 }}
                      className={`hover:bg-white/5 ${
                        user.isRealUser ? "bg-sky-400/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-white/70">{i + 1}</td>
                      <td className="px-4 py-4 font-medium">
                        <div className="flex items-center gap-2">
                          {user.name}
                          {user.isRealUser && (
                            <span className="rounded-full bg-sky-400/20 px-2 py-0.5 text-xs text-sky-300">
                              Вы
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sky-400">
                            {user.points.toLocaleString()}
                          </span>
                          <span className="text-xs text-white/50">баллов</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-sky-400 to-cyan-400"
                              initial={{ width: 0 }}
                              whileInView={{
                                width: `${user.completionPercent}%`,
                              }}
                              viewport={{ once: true }}
                              transition={{
                                delay: i * 0.04 + 0.2,
                                duration: 0.5,
                              }}
                            />
                          </div>
                          <span className="text-sm text-white/70 min-w-[3rem] text-right">
                            {user.completionPercent}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-16 md:py-24">
        <SectionTitle
          eyebrow={t("reviewsEyebrow")}
          title={t("reviewsTitle")}
          desc={t("reviewsDesc")}
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {testimonials.map((tt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sm ring-1 ring-inset ring-sky-400/20">
                    {tt.name[0]}
                  </div>
                  <div>
                    <div className="font-medium dark:text-white">{tt.name}</div>
                    <div className="text-xs text-neutral-600 dark:text-white/60">
                      {tt.role}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-neutral-800 dark:text-white/80">
                  “{tt.text}”
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl px-4">
          <GlassCard>
            <form
              onSubmit={handleReviewSubmit}
              className="grid gap-3 md:grid-cols-3"
            >
              <div className="md:col-span-1">
                <label className="text-xs text-neutral-600 dark:text-white/60">
                  {t("review.form.name")}
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40"
                  placeholder={t("review.form.namePh")}
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-neutral-600 dark:text-white/60">
                  {t("review.form.role")}
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40"
                  placeholder={t("review.form.rolePh")}
                  value={reviewForm.role}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, role: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-neutral-600 dark:text-white/60">
                  {t("review.form.text")}
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40"
                  rows={3}
                  placeholder={t("review.form.textPh")}
                  value={reviewForm.text}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, text: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-3 flex items-center justify-between">
                <button className="rounded-lg bg-sky-400 px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-sky-300">
                  {t("review.form.submit")}
                </button>
                {reviewMsg && (
                  <span className="text-xs text-neutral-700 dark:text-white/70">
                    {reviewMsg}
                  </span>
                )}
              </div>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* CTA + форма */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-2">
          <GlassCard className="relative overflow-hidden text-center">
            <div
              className="absolute -left-16 -top-16 h-40 w-40 rounded-full"
              style={{ background: `${brand.accent}22` }}
            />
            <div
              className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full"
              style={{ background: `${brand.primary}22` }}
            />
            <h3 className="text-2xl md:text-3xl font-semibold dark:text-white">
              {t("cta.title")}
            </h3>
            <p className="mt-2 text-neutral-700 dark:text-white/70">
              {t("cta.text")}
            </p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LocalizedLink
                href="/materials"
                className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-medium text-neutral-950 hover:bg-sky-300"
              >
                {t("cta.primary")}
              </LocalizedLink>
              <LocalizedLink
                href="/courses"
                className="rounded-xl border border-black/10 bg-white/60 px-6 py-3 text-sm hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {t("cta.secondary")}
              </LocalizedLink>
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-xl font-semibold dark:text-white">
              {t("signup.title")}
            </h4>
            <p className="mt-1 text-neutral-700 text-sm dark:text-white/70">
              {t("signup.text")}
            </p>
            <form onSubmit={handleSignupSubmit} className="mt-4 grid gap-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-white/60">
                    {t("signup.form.name")}
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40"
                    placeholder={t("signup.form.namePh")}
                    value={signupForm.name}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-white/60">
                    {t("signup.form.email")}
                  </label>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40"
                    placeholder={t("signup.form.emailPh")}
                    value={signupForm.email}
                    onChange={(e) =>
                      setSignupForm({ ...signupForm, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-600 dark:text-white/60">
                  {t("signup.form.course")}
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5"
                  value={signupForm.course}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, course: e.target.value })
                  }
                >
                  {courses.map((c) => (
                    <option
                      key={c.title}
                      value={c.title}
                      className="bg-white dark:bg-neutral-900"
                    >
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button className="rounded-lg bg-sky-400 px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-sky-300">
                  {t("signup.form.submit")}
                </button>
                {signupMsg && (
                  <span className="text-xs text-neutral-700 dark:text-white/70">
                    {signupMsg}
                  </span>
                )}
              </div>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})`,
              }}
            />
            <span className="text-sm text-neutral-700 dark:text-white/70">
              © {new Date().getFullYear()} Kazakh Learn
            </span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-white/50">
            {t("footer.legal")}
          </div>
        </div>
      </footer>
    </div>
  );
}
