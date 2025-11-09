"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    transition: { staggerChildren: 0.08, ease: "easeOut", duration: 0.6 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.5 } },
};

const shine = {
  initial: { backgroundPosition: "200% 0" },
  animate: {
    backgroundPosition: "-200% 0",
    transition: { repeat: Infinity, duration: 7, ease: "linear" },
  },
};

// Брендовая палитра (светло-голубая)
const brand = {
  primary: "#38bdf8", // tailwind sky-400
  secondary: "#22d3ee", // tailwind cyan-400
  accent: "#93c5fd", // tailwind blue-300
};

const stars = (count: number) => (
  <div className="flex items-center gap-1" aria-label={`${count} из 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`h-4 w-4 ${i < count ? "fill-sky-400" : "fill-white/25"}`}
      >
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

const TopBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/90 backdrop-blur">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-sky-400">
      <path d="M12 2 15 9l7 .5-5.5 4.5L18.5 21 12 17.5 5.5 21l1-7L1 9.5 8 9z" />
    </svg>
    Выбор студентов
  </span>
);

const ratingsData = [
  { name: "Базовый курс A1", score: 5, votes: 412 },
  { name: "Разговорная практика", score: 5, votes: 365 },
  { name: "Казахский для работы", score: 4, votes: 298 },
  { name: "Грамматика интенсив", score: 4, votes: 241 },
  { name: "Подготовка к экзамену", score: 4, votes: 189 },
];

const features = [
  {
    title: "Уроки по 15 минут",
    desc: "Лаконичные модули и чекпоинты для уверенного прогресса каждый день.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
        <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9Zm.5-14h-2v6h6v-2h-4Z" />
      </svg>
    ),
  },
  {
    title: "Натаскивание на речь",
    desc: "AI-диалоги: говорите, получайте обратную связь, исправления и подсказки.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
        <path d="M12 3a9 9 0 0 0-9 9 8.93 8.93 0 0 0 2.64 6.36L3 21l2.64-2.64A8.93 8.93 0 0 0 12 21a9 9 0 0 0 0-18Zm0 16a7 7 0 0 1-4.65-1.77l-.33-.29-1.33 1.33.29.33A8.9 8.9 0 0 0 12 20a8 8 0 1 0-8-8 8.9 8.9 0 0 0 1.4 4.65l.33.29 1.33-1.33-.29-.33A7 7 0 1 1 12 19Zm-1-6h2v-6h-2Zm0 4h2v-2h-2Z" />
      </svg>
    ),
  },
  {
    title: "Качественные материалы",
    desc: "Современные видеоуроки, структурированные материалы и наглядные объяснения.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
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
    text:
      "Занятия короткие и динамичные. Через месяц уже спокойно общаюсь с коллегами.",
  },
  {
    name: "Ермек",
    role: "Студент",
    text:
      "Понравилась практика речи с ИИ и поддержка наставника. Прогресс стабильно ощущается.",
  },
  {
    name: "Мария",
    role: "Маркетолог",
    text:
      "Классный интерфейс, задания по делу. Рейтинг помог выбрать курс под цель.",
  },
];

function GlassCard({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <motion.div variants={item} className="mb-2 text-xs uppercase tracking-[0.2em] text-white/60">
          {eyebrow}
        </motion.div>
      )}
      <motion.h2 variants={item} className="text-3xl md:text-4xl font-semibold text-white">
        {title}
      </motion.h2>
      {desc && (
        <motion.p variants={item} className="mt-3 text-white/70">
          {desc}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      {/* Фоновые градиенты (обновлены под голубую палитру) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(50% 50% at 50% 50%, ${brand.primary} 0%, rgba(34,211,238,0) 70%)` }}
          initial={{ scale: 0.9, opacity: 0.18 }}
          animate={{ scale: 1.05, opacity: 0.35 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/4 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(50% 50% at 50% 50%, ${brand.secondary} 0%, rgba(147,197,253,0) 70%)` }}
          initial={{ scale: 0.9, opacity: 0.15 }}
          animate={{ scale: 1.08, opacity: 0.28 }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Навбар */}
      <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2">
            <motion.div
              className="h-8 w-8 rounded-xl"
              style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})` }}
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
            <span className="text-lg font-semibold tracking-tight">Kazakh Learn</span>
          </a>
          <nav className="hidden gap-6 text-sm text-white/80 md:flex">
            <a className="hover:text-white" href="#features">Преимущества</a>
            <a className="hover:text-white" href="#courses">Курсы</a>
            <a className="hover:text-white" href="#rating">Рейтинг</a>
            <a className="hover:text-white" href="#reviews">Отзывы</a>
          </nav>
          <Link href="/auth" className="rounded-xl bg-sky-400 text-neutral-950 px-4 py-2 text-sm font-medium hover:bg-sky-300 transition">Начать</Link>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-20 md:grid-cols-2 md:py-28">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
            <TopBadge />
            <motion.h1 variants={item} className="text-4xl md:text-6xl font-semibold leading-[1.1]">
              Казахский с нуля до уверенного общения
            </motion.h1>
            <motion.p variants={item} className="text-white/70">
              Интерактивные уроки, тренажеры речи и поддержка наставников. Учитесь 15 минут в день — прогресс уже через неделю.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="#cta" className="rounded-xl bg-sky-400 text-neutral-950 px-5 py-3 text-sm font-medium hover:bg-sky-300 transition">Попробовать бесплатно</a>
              <a href="#features" className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm hover:bg-white/10 transition">Как это работает</a>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-6 inline-block rounded-xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-[1px]"
            >
              <motion.div
                className="rounded-[11px] px-4 py-2 text-xs text-white/80"
                style={{
                  backgroundImage:
                    `linear-gradient(120deg, rgba(147,197,253,0.18), rgba(255,255,255,0.04), rgba(56,189,248,0.18))`,
                  backgroundSize: "200% 100%",
                }}
                initial={shine.initial}
                animate={shine.animate}
              >
                25 000+ студентов • Средняя оценка 4.8/5 • Сертификат по итогам
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ type: "spring", stiffness: 100, damping: 16 }}
          >
            <GlassCard className="relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full" style={{ background: `${brand.primary}22` }} />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-white/70">Мини-урок</div>
                  <div className="text-xl font-medium">Салем! Қалын қалай?</div>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">A1</div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/60">Фраза</div>
                  <div className="mt-1">Менің атым Алия</div>
                  <div className="text-xs text-white/50">Меня зовут Алия</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/60">Практика</div>
                  <div className="mt-1">Салем, танысканыма куаныштымын!</div>
                  <div className="text-xs text-white/50">Приятно познакомиться!</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-white/70">Время: 04:32</div>
                <button className="rounded-lg bg-sky-400 px-4 py-2 text-sm text-neutral-950 hover:bg-sky-300">Начать урок</button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24">
        <SectionTitle
          eyebrow="Почему мы"
          title="Быстро, практично, современно"
          desc="Фокус на речевой практике, наглядные примеры и четкая структура занятий."
        />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-3">
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
                  <div className="rounded-xl bg-sky-400/10 p-3 ring-1 ring-inset ring-sky-400/20">{f.icon}</div>
                  <div>
                    <div className="text-lg font-medium">{f.title}</div>
                    <p className="mt-1 text-white/70">{f.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="courses" className="py-16 md:py-24">
        <SectionTitle eyebrow="Программы" title="Курсы под ваш уровень" desc="От алфавита до уверенных переговоров." />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {courses.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-medium">{c.title}</div>
                  <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-1 text-xs text-sky-300">{c.level}</div>
                </div>
                <p className="mt-2 text-white/70">{c.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-white/60">{c.hours} академ. часов</div>
                  <button className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Подробнее</button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="rating" className="py-16 md:py-24">
        <SectionTitle eyebrow="Рейтинг" title="ТОП‑5 популярных курсов" desc="Основано на оценках студентов и количестве завершений." />
        <div className="mx-auto mt-10 max-w-4xl px-4">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full table-auto divide-y divide-white/10 bg-white/5">
              <thead>
                <tr className="text-left text-sm text-white/70">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Курс</th>
                  <th className="px-4 py-3">Оценка</th>
                  <th className="px-4 py-3">Отклики</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ratingsData.map((r, i) => (
                  <motion.tr
                    key={r.name}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-4 py-4 text-white/70">{i + 1}</td>
                    <td className="px-4 py-4 font-medium">{r.name}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {stars(r.score)}
                        <span className="text-sm text-white/70">{r.score}.0</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/70">{r.votes.toLocaleString()} оценок</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section id="reviews" className="py-16 md:py-24">
        <SectionTitle eyebrow="Опыт студентов" title="Что говорят выпускники" />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sm ring-1 ring-inset ring-sky-400/20">{t.name[0]}</div>
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-white/60">{t.role}</div>
                  </div>
                </div>
                <p className="mt-3 text-white/80">“{t.text}”</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <GlassCard className="relative overflow-hidden text-center">
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full" style={{ background: `${brand.accent}22` }} />
            <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full" style={{ background: `${brand.primary}22` }} />
            <h3 className="text-2xl md:text-3xl font-semibold">Готовы начать?</h3>
            <p className="mt-2 text-white/70">Откройте доступ к первому модулю бесплатно. Без карты и обязательств.</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth" className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-medium text-neutral-950 hover:bg-sky-300">Начать обучение</Link>
              <a href="#courses" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm hover:bg-white/10">Выбрать курс</a>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Футер */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})` }} />
            <span className="text-sm text-white/70">© {new Date().getFullYear()} Kazakh Learn</span>
          </div>
          <div className="text-xs text-white/50">
            Политика конфиденциальности · Условия использования
          </div>
        </div>
      </footer>
    </div>
  );
}
