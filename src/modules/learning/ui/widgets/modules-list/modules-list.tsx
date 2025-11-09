"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { useLearningStore } from "../../../model/learning.store";
import { isModuleAvailable } from "../../../utils/learning.utils";
import {
  getLocalizedModules,
  getMockUserProgress,
} from "../../../utils/mock-data";
import { ModuleIcon } from "../../components/module-icon";

// Брендовая палитра
const brand = {
  primary: "#38bdf8",
  secondary: "#22d3ee",
  accent: "#93c5fd",
};

/**
 * Виджет списка модулей обучения
 */
export function ModulesList(): React.JSX.Element {
  const locale = useLocale();
  const t = useTranslations("learning");
  const { modules, userProgress, setModules, setUserProgress } =
    useLearningStore();
  const [isMounted, setIsMounted] = useState(false);

  // Загружаем моковые данные при монтировании
  useEffect(() => {
    setIsMounted(true);
    if (modules.length === 0) {
      const localizedModules = getLocalizedModules(
        locale as "ru" | "en" | "kk"
      );
      setModules(localizedModules);
    }
    if (!userProgress) {
      const progress = getMockUserProgress();
      setUserProgress(progress);
    }
  }, [modules.length, userProgress, setModules, setUserProgress, locale]);

  // Предотвращаем гидратацию, пока данные не загружены
  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-neutral-700 dark:text-white/70">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white text-neutral-900 scroll-smooth dark:bg-neutral-950 dark:text-white">
      {/* Фоновые градиенты */}
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

      {/* Hero секция */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] text-neutral-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-lg text-neutral-700 dark:text-white/70">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Сетка модулей */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {modules.map((module, index) => {
              const isAvailable = isModuleAvailable(
                module,
                index,
                modules,
                userProgress
              );

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <ModuleIcon
                    module={module}
                    moduleIndex={index}
                    userProgress={userProgress}
                    isAvailable={isAvailable}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
