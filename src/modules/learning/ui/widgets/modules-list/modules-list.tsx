"use client";

import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { useLearningStore } from "../../../model/learning.store";
import { isModuleAvailable } from "../../../utils/learning.utils";
import {
  getLocalizedModules,
  getMockUserProgress,
} from "../../../utils/mock-data";
import { ModuleIcon } from "../../components/module-icon";

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
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-700 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-white">{t("title")}</h1>
            <p className="text-white/90">{t("subtitle")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-700 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">{t("title")}</h1>
          <p className="text-white/90">{t("subtitle")}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {modules.map((module, index) => {
            const isAvailable = isModuleAvailable(
              module,
              index,
              modules,
              userProgress
            );

            return (
              <ModuleIcon
                key={module.id}
                module={module}
                moduleIndex={index}
                userProgress={userProgress}
                isAvailable={isAvailable}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
