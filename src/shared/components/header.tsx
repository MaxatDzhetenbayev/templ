"use client";

import { useLearningStore } from "@/modules/learning/model/learning.store";
import { getOverallProgress } from "@/modules/learning/utils/learning.utils";
import {
  getLocalizedModules,
  getMockUserProgress,
} from "@/modules/learning/utils/mock-data";
import { Link, useRouter } from "@/shared/configs/i18/navigation";
import {
  getCurrentUser,
  mockLogout,
  type MockUser,
} from "@/shared/lib/mock-auth";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

// Брендовая палитра (светло-голубая)
const brand = {
  primary: "#38bdf8", // tailwind sky-400
  accent: "#93c5fd", // tailwind blue-300
};

/**
 * Header компонент с навигацией и информацией о пользователе
 *
 * @returns JSX элемент с шапкой приложения
 */
export function Header(): React.JSX.Element {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("learning");
  const tCommon = useTranslations();
  const [user, setUser] = useState<MockUser | null>(null);
  const { modules, userProgress, setModules, setUserProgress } =
    useLearningStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Получаем текущего пользователя при монтировании
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsMounted(true);

    // Инициализируем модули и прогресс, если они еще не загружены
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

  // Используем модули из store или моковые данные
  const allModules =
    modules.length > 0
      ? modules
      : getLocalizedModules(locale as "ru" | "en" | "kk");
  const overallProgress = getOverallProgress(allModules, userProgress);
  const totalPoints = userProgress?.totalPoints || 0;

  /**
   * Обработчик выхода из системы
   */
  const handleLogout = (): void => {
    mockLogout();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
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
        </Link>

        <div className="flex items-center gap-4">
          {user && isMounted && (
            <>
              {/* Баллы и прогресс-бар */}
              <div className="hidden items-center gap-4 md:flex">
                {/* Баллы */}
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 ring-1 ring-inset ring-white/10">
                  <span className="text-sm font-medium text-white/90">
                    {totalPoints}
                  </span>
                  <span className="text-xs text-white/60">{t("points")}</span>
                </div>

                {/* Прогресс-бар */}
                <div className="flex min-w-[120px] flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">
                      {overallProgress.completedTasks}/
                      {overallProgress.totalTasks}
                    </span>
                    <span className="text-white/70">
                      {overallProgress.percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300"
                      style={{ width: `${overallProgress.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Аватар и имя */}
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/10 text-sm font-medium text-white ring-1 ring-inset ring-sky-400/20">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-white/90">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
              >
                {tCommon("logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
