"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import Header from "@/shared/components/header";
import { useLocale, useTranslations } from "next-intl";

const container = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, ease: "easeOut", duration: 0.6 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.5 } },
};
const shine = {
  initial: { backgroundPosition: "200% 0" },
  animate: { backgroundPosition: "-200% 0", transition: { repeat: Infinity, duration: 7, ease: "linear" } },
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
    <div className={`rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-white/5 ${className}`}>
      {children}
    </div>
  );
}
function SectionTitle({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mx-auto max-w-2xl text-center">
      {eyebrow && <motion.div variants={item} className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-white/60">{eyebrow}</motion.div>}
      <motion.h2 variants={item} className="text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">{title}</motion.h2>
      {desc && <motion.p variants={item} className="mt-3 text-neutral-700 dark:text-white/70">{desc}</motion.p>}
    </motion.div>
  );
}

const stars = (count: number) => (
  <div className="flex items-center gap-1" aria-label={`${count} из 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`h-4 w-4 ${i < count ? "fill-sky-400" : "fill-white/25"}`}>
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

const TopBadge = ({ text }: { text: string }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs tracking-wide text-neutral-700 backdrop-blur dark:border-white/15 dark:bg-white/5 dark:text-white/90">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-sky-400">
      <path d="M12 2 15 9l7 .5-5.5 4.5L18.5 21 12 17.5 5.5 21l1-7L1 9.5 8 9z" />
    </svg>
    {text}
  </span>
);

export default function Page() {
  const t = useTranslations("landing");
  const locale = useLocale();

  const courses = useMemo(
    () => [
      { title: t("courses.a1") },
      { title: t("courses.a2") },
      { title: t("courses.b1") },
      { title: t("courses.b2") },
    ],
    [t]
  );

  const features = useMemo(
    () => [
      {
        title: t("features.0.title"),
        desc: t("features.0.desc"),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
            <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9Zm.5-14h-2v6h6v-2h-4Z" />
          </svg>
        ),
      },
      {
        title: t("features.1.title"),
        desc: t("features.1.desc"),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
            <path d="M12 3a9 9 0 0 0-9 9 8.93 8.93 0 0 0 2.64 6.36L3 21l2.64-2.64A8.93 8.93 0 0 0 12 21a9 9 0 0 0 0-18Zm0 16a7 7 0 0 1-4.65-1.77l-.33-.29-1.33 1.33.29.33A8.9 8.9 0 0 0 12 20a8 8 0 1 0-8-8 8.9 8.9 0 0 0 1.4 4.65l.33.29 1.33-1.33-.29-.33A7 7 0 1 1 12 19Zm-1-6h2v-6h-2Zm0 4h2v-2h-2Z" />
          </svg>
        ),
      },
      {
        title: t("features.2.title"),
        desc: t("features.2.desc"),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
            <path d="M12 12a5 5 0 1 0-5-5 5.006 5.006 0 0 0 5 5Zm0 2c-3.86 0-7 2.14-7 4.78V22h14v-3.22C19 16.14 15.86 14 12 14Z" />
          </svg>
        ),
      },
      {
        title: t("features.3.title"),
        desc: t("features.3.desc"),
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-sky-400">
            <path d="M8 5v14l11-7-11-7Z" />
          </svg>
        ),
      },
    ],
    [t]
  );

  const materials = useMemo(
    () => [
      { tag: t("materials.0.tag"), title: t("materials.0.title"), duration: "8:45" },
      { tag: t("materials.1.tag"), title: t("materials.1.title"), duration: "5:20" },
      { tag: t("materials.2.tag"), title: t("materials.2.title"), duration: "7:10" },
      { tag: t("materials.3.tag"), title: t("materials.3.title"), duration: "6:00" },
    ],
    [t]
  );

  const userLeaders = useMemo(
    () => [
      { name: "Aidana K.", points: 1840, streak: 21 },
      { name: "Timur U.", points: 1765, streak: 18 },
      { name: "Alina Z.", points: 1690, streak: 17 },
      { name: "Dauren S.", points: 1585, streak: 16 },
      { name: "Madi R.", points: 1500, streak: 14 },
    ],
    []
  );
  const formattedLeaders = useMemo(() => userLeaders.sort((a, b) => b.points - a.points).slice(0, 5), [userLeaders]);

  const initialTestimonials = useMemo(
    () => [
      { name: t("testimonials.0.name"), role: t("testimonials.0.role"), text: t("testimonials.0.text") },
      { name: t("testimonials.1.name"), role: t("testimonials.1.role"), text: t("testimonials.1.text") },
      { name: t("testimonials.2.name"), role: t("testimonials.2.role"), text: t("testimonials.2.text") },
    ],
    [t]
  );

  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [reviewForm, setReviewForm] = useState({ name: "", role: "", text: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", course: courses[0]?.title || "" });
  const [reviewMsg, setReviewMsg] = useState<string | null>(null);
  const [signupMsg, setSignupMsg] = useState<string | null>(null);

  // Обновляем зависящие от переводов части при смене языка
  useEffect(() => {
    setTestimonials(initialTestimonials);
    setSignupForm((s) => ({ ...s, course: courses[0]?.title || "" }));
  }, [locale, initialTestimonials, courses]);

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) {
      setReviewMsg(t("review.form.errors.required"));
      return;
    }
    setTestimonials((prev) => [{ name: reviewForm.name, role: reviewForm.role || t("review.form.defaultRole"), text: reviewForm.text }, ...prev]);
    setReviewForm({ name: "", role: "", text: "" });
    setReviewMsg(t("review.form.success"));
    setTimeout(() => setReviewMsg(null), 4000);
  }

  function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email) {
      setSignupMsg(t("signup.form.errors.required"));
      return;
    }
    setSignupMsg(t("signup.form.success"));
    setTimeout(() => setSignupMsg(null), 5000);
    setSignupForm({ ...signupForm, name: "", email: "" });
  }

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 scroll-smooth dark:bg-neutral-950 dark:text-white">
      {/* Фоны */}
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

      <Header user={null} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-20 md:grid-cols-2 md:py-28">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
            <TopBadge text={t("hero.badge")} />
            <motion.h1 variants={item} className="text-4xl md:text-6xl font-semibold leading-[1.1] dark:text-white">
              {t("hero.title")}
            </motion.h1>
            <motion.p variants={item} className="text-neutral-700 dark:text-white/70">
              {t("hero.text")}
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 pt-2">
              <LocalizedLink href="/courses" className="rounded-xl bg-sky-400 text-neutral-950 px-5 py-3 text-sm font-medium hover:bg-sky-300 transition">
                {t("hero.ctaPrimary")}
              </LocalizedLink>
              <LocalizedLink href="/materials" className="rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm hover:bg-white/80 transition dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
                {t("hero.ctaSecondary")}
              </LocalizedLink>
            </motion.div>

            <motion.div variants={item} className="mt-6 inline-block rounded-xl border border-black/10 bg-gradient-to-r from-black/10 via-black/5 to-black/10 p-[1px] dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/10">
              <motion.div
                className="rounded-[11px] px-4 py-2 text-xs text-neutral-700 dark:text-white/80"
                style={{ backgroundImage: `linear-gradient(120deg, rgba(147,197,253,0.18), rgba(255,255,255,0.04), rgba(56,189,248,0.18))`, backgroundSize: "200% 100%" }}
                initial={shine.initial}
                animate={shine.animate}
              >
                {t("hero.metrics")}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Мини-урок */}
          <motion.div className="relative" initial={{ opacity: 0, y: 24, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: "-120px" }} transition={{ type: "spring", stiffness: 100, damping: 16 }}>
            <GlassCard className="relative overflow-hidden">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full" style={{ background: `${brand.primary}22` }} />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-neutral-600 dark:text-white/70">{t("mini.lessonLabel")}</div>
                  <div className="text-xl font-medium">{t("mini.title")}</div>
                </div>
                <div className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs dark:border-white/15 dark:bg-white/10">A1</div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">{t("mini.phraseLabel")}</div>
                  <div className="mt-1">{t("mini.phrase.kz")}</div>
                  <div className="text-xs text-neutral-500 dark:text-white/50">{t("mini.phrase.ru")}</div>
                </div>
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">{t("mini.aiPracticeLabel")}</div>
                  <div className="mt-1">{t("mini.ai.kz")}</div>
                  <div className="text-xs text-neutral-500 dark:text-white/50">{t("mini.ai.ru")}</div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">{t("mini.quizLabel")}</div>
                  <div className="mt-1 text-sm">{t("mini.quizQuestion")}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {[{ t: t("mini.options.0"), ok: true }, { t: t("mini.options.1"), ok: false }, { t: t("mini.options.2"), ok: false }].map((o, i) => (
                      <span key={i} className={`rounded-md px-2 py-1 ${o.ok ? "bg-sky-400/20 text-sky-700 dark:text-sky-300" : "bg-black/5 text-neutral-600 dark:bg-white/5 dark:text-white/70"}`}>{o.t}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs text-neutral-600 dark:text-white/60">{t("mini.timeLabel")}</div>
                  <div className="mt-1">04:32</div>
                  <LocalizedLink href="/courses" className="mt-3 inline-block rounded-lg bg-sky-400 px-4 py-2 text-sm text-neutral-950 hover:bg-sky-300">
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
        <SectionTitle eyebrow={t("featuresEyebrow")} title={t("featuresTitle")} desc={t("featuresDesc")} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.05 }}>
              <GlassCard>
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-sky-400/10 p-3 ring-1 ring-inset ring-sky-400/20">{f.icon}</div>
                  <div>
                    <div className="text-lg font-medium dark:text-white">{f.title}</div>
                    <p className="mt-1 text-neutral-700 dark:text-white/70">{f.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Материалы */}
      <section className="py-16 md:py-24">
        <SectionTitle eyebrow={t("libraryEyebrow")} title={t("libraryTitle")} desc={t("libraryDesc")} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-4">
          {materials.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="overflow-hidden">
                <div className="rounded-xl border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
                  <div className="relative h-36 w-full overflow-hidden rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-400/10 ring-1 ring-black/10 dark:ring-white/10">
                    <div className="absolute inset-0 grid place-items-center text-neutral-700 dark:text-white/80">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-10 w-10 fill-current"><path d="M8 5v14l11-7-11-7Z" /></svg>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300">
                    <span className="rounded-md border border-sky-400/30 bg-sky-400/10 px-2 py-0.5">{m.tag}</span>
                    <span className="text-neutral-600 dark:text-white/60">{t("video")} • {m.duration}</span>
                  </div>
                  <div className="mt-2 font-medium dark:text-white">{m.title}</div>
                  <LocalizedLink href="/materials" className="mt-3 inline-block w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
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
        <SectionTitle eyebrow={t("gamificationEyebrow")} title={t("topTitle")} desc={t("topDesc")} />
        <div className="mx-auto mt-10 max-w-3xl px-4">
          <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <table className="w-full table-auto divide-y divide-black/10 bg-white/70 dark:divide-white/10 dark:bg-white/5">
              <thead>
                <tr className="text-left text-sm text-neutral-700 dark:text-white/70">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">{t("top.table.student")}</th>
                  <th className="px-4 py-3">{t("top.table.points")}</th>
                  <th className="px-4 py-3">{t("top.table.streak")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {formattedLeaders.map((u, i) => (
                  <motion.tr key={u.name} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.04 }} className="hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="px-4 py-4 text-neutral-600 dark:text-white/70">{i + 1}</td>
                    <td className="px-4 py-4 font-medium dark:text-white">{u.name}</td>
                    <td className="px-4 py-4 text-neutral-800 dark:text-white/80">{u.points.toLocaleString()}</td>
                    <td className="px-4 py-4 text-neutral-700 dark:text-white/70">{u.streak} {t("top.table.daysShort")}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-16 md:py-24">
        <SectionTitle eyebrow={t("reviewsEyebrow")} title={t("reviewsTitle")} desc={t("reviewsDesc")} />
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          {testimonials.map((tt, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.05 }}>
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sm ring-1 ring-inset ring-sky-400/20">{tt.name[0]}</div>
                  <div>
                    <div className="font-medium dark:text-white">{tt.name}</div>
                    <div className="text-xs text-neutral-600 dark:text-white/60">{tt.role}</div>
                  </div>
                </div>
                <p className="mt-3 text-neutral-800 dark:text-white/80">“{tt.text}”</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl px-4">
          <GlassCard>
            <form onSubmit={handleReviewSubmit} className="grid gap-3 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="text-xs text-neutral-600 dark:text-white/60">{t("review.form.name")}</label>
                <input className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40" placeholder={t("review.form.namePh")} value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} />
              </div>
              <div className="md:col-span-1">
                <label className="text-xs text-neutral-600 dark:text-white/60">{t("review.form.role")}</label>
                <input className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40" placeholder={t("review.form.rolePh")} value={reviewForm.role} onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })} />
              </div>
              <div className="md:col-span-3">
                <label className="text-xs text-neutral-600 dark:text-white/60">{t("review.form.text")}</label>
                <textarea className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40" rows={3} placeholder={t("review.form.textPh")} value={reviewForm.text} onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })} />
              </div>
              <div className="md:col-span-3 flex items-center justify-between">
                <button className="rounded-lg bg-sky-400 px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-sky-300">{t("review.form.submit")}</button>
                {reviewMsg && <span className="text-xs text-neutral-700 dark:text-white/70">{reviewMsg}</span>}
              </div>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* CTA + форма */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-2">
          <GlassCard className="relative overflow-hidden text-center">
            <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full" style={{ background: `${brand.accent}22` }} />
            <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full" style={{ background: `${brand.primary}22` }} />
            <h3 className="text-2xl md:text-3xl font-semibold dark:text-white">{t("cta.title")}</h3>
            <p className="mt-2 text-neutral-700 dark:text-white/70">{t("cta.text")}</p>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LocalizedLink href="/materials" className="rounded-xl bg-sky-400 px-6 py-3 text-sm font-medium text-neutral-950 hover:bg-sky-300">
                {t("cta.primary")}
              </LocalizedLink>
              <LocalizedLink href="/courses" className="rounded-xl border border-black/10 bg-white/60 px-6 py-3 text-sm hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
                {t("cta.secondary")}
              </LocalizedLink>
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-xl font-semibold dark:text-white">{t("signup.title")}</h4>
            <p className="mt-1 text-neutral-700 text-sm dark:text-white/70">{t("signup.text")}</p>
            <form onSubmit={handleSignupSubmit} className="mt-4 grid gap-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs text-neutral-600 dark:text-white/60">{t("signup.form.name")}</label>
                  <input className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40" placeholder={t("signup.form.namePh")} value={signupForm.name} onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-neutral-600 dark:text-white/60">{t("signup.form.email")}</label>
                  <input type="email" className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40" placeholder={t("signup.form.emailPh")} value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-xs text-neutral-600 dark:text-white/60">{t("signup.form.course")}</label>
                <select className="mt-1 w-full rounded-lg border border-black/10 bg-white/60 px-3 py-2 text-sm outline-none focus:border-sky-400/40 dark:border-white/10 dark:bg-white/5" value={signupForm.course} onChange={(e) => setSignupForm({ ...signupForm, course: e.target.value })}>
                  {courses.map((c) => (<option key={c.title} value={c.title} className="bg-white dark:bg-neutral-900">{c.title}</option>))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button className="rounded-lg bg-sky-400 px-5 py-2 text-sm font-medium text-neutral-950 hover:bg-sky-300">{t("signup.form.submit")}</button>
                {signupMsg && <span className="text-xs text-neutral-700 dark:text-white/70">{signupMsg}</span>}
              </div>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg" style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})` }} />
            <span className="text-sm text-neutral-700 dark:text-white/70">© {new Date().getFullYear()} Kazakh Learn</span>
          </div>
          <div className="text-xs text-neutral-500 dark:text-white/50">{t("footer.legal")}</div>
        </div>
      </footer>
    </div>
  );
}
