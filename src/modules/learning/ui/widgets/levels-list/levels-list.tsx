"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useRouter } from "@/shared/configs/i18/navigation";

import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";

import { useLearningStore } from "../../../model/learning.store";
import type { Level, Module, Task } from "../../../schemas/learning.schema";
import {
  getLevelProgress,
  getModuleProgress,
  isLevelAvailable,
} from "../../../utils/learning.utils";
import {
  getLocalizedModules,
  getMockUserProgress,
} from "../../../utils/mock-data";
import { getNextLevelTasks } from "../../../utils/task-randomizer";
import { LevelStepper } from "../../widgets";

// Брендовая палитра
const brand = {
  primary: "#38bdf8",
  secondary: "#22d3ee",
  accent: "#93c5fd",
};

/**
 * Виджет списка уровней модуля
 */
export function LevelsList(): React.JSX.Element {
  const locale = useLocale();
  const t = useTranslations("learning");
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const {
    modules,
    userProgress,
    setModules,
    setUserProgress,
    validateProgress,
    completeLevel,
    addPoints,
    subtractPoints,
    updateLevelTaskProgress,
  } = useLearningStore();

  // Получаем функцию для доступа к актуальному состоянию store
  const getStoreState = useLearningStore.getState;

  const [module, setModule] = useState<Module | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const initializedRef = React.useRef(false);
  const validatedRef = React.useRef(false);

  // Инициализация: загружаем модули и прогресс только один раз
  useEffect(() => {
    setIsMounted(true);

    if (initializedRef.current) return;

    // Загружаем модули, если они еще не загружены
    if (modules.length === 0) {
      const localizedModules = getLocalizedModules(
        locale as "ru" | "en" | "kk"
      );
      setModules(localizedModules);
    }

    // Загружаем прогресс, если он еще не загружен
    if (!userProgress) {
      const progress = getMockUserProgress();
      setUserProgress(progress);
    }

    initializedRef.current = true;
  }, [modules.length, userProgress, setModules, setUserProgress, locale]);

  // Находим нужный модуль при изменении moduleId или modules
  useEffect(() => {
    if (!isMounted) return;

    const foundModule = modules.find((m) => m.id === moduleId);
    if (foundModule) {
      setModule(foundModule);
    } else {
      const localizedModules = getLocalizedModules(
        locale as "ru" | "en" | "kk"
      );
      const mockModule = localizedModules.find((m) => m.id === moduleId);
      if (mockModule) setModule(mockModule);
    }
  }, [moduleId, modules, isMounted, locale]);

  // Валидируем прогресс после загрузки модулей и прогресса (только один раз)
  useEffect(() => {
    if (
      modules.length > 0 &&
      userProgress &&
      initializedRef.current &&
      !validatedRef.current
    ) {
      // Валидируем прогресс с загруженными модулями
      validateProgress();
      validatedRef.current = true;
    }
    // validateProgress - стабильная функция из Zustand, не нужно добавлять в зависимости
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules.length, userProgress]);

  const handleLevelClick = (level: Level, levelIndex: number) => {
    const moduleProgress = getModuleProgress(moduleId, userProgress);
    const isAvailable = isLevelAvailable(
      level,
      levelIndex,
      moduleProgress,
      module || undefined
    );

    if (!isAvailable) return;

    const levelProgress = getLevelProgress(level.id, moduleProgress);
    const tasks = getNextLevelTasks(
      level.taskPool,
      levelProgress || { tasksProgress: [] },
      level.tasksPerLevel
    );

    setSelectedLevel(level);
    setCurrentTasks(tasks);
  };

  const handleTaskAnswer = (
    taskId: string,
    isCorrect: boolean,
    points: number
  ) => {
    if (!selectedLevel || !module) return;

    // Сохраняем прогресс задания в store
    updateLevelTaskProgress(
      moduleId,
      selectedLevel.id,
      taskId,
      isCorrect ? "completed" : "available",
      isCorrect ? points : undefined
    );

    if (isCorrect) {
      // Начисляем баллы за правильный ответ
      addPoints(points);
    } else {
      // Снимаем 10 баллов за ошибку (но не меньше 0)
      subtractPoints(10);
    }
  };

  const handleTasksShuffle = (shuffledTasks: Task[]) => {
    setCurrentTasks(shuffledTasks);
  };

  const handleLevelComplete = () => {
    if (!selectedLevel || !module || !module.levels) return;

    // Сохраняем ID завершенного уровня
    const completedLevelId = selectedLevel.id;

    // Получаем список ID всех задач из текущего набора
    // Это гарантирует, что все 4 задачи будут сохранены в tasksProgress
    const completedTaskIds = currentTasks.map((task) => task.id);

    // Завершаем уровень - это обновит store синхронно
    // Передаем список выполненных задач, чтобы убедиться, что все они сохранены
    // НЕ закрываем модальное окно - оно закроется при нажатии кнопки "Закрыть"
    completeLevel(moduleId, completedLevelId, completedTaskIds);

    // Валидируем прогресс после завершения уровня, чтобы убедиться,
    // что модуль правильно помечается как завершенный
    setTimeout(() => {
      validateProgress();
    }, 100);
  };

  const handleStepperClose = () => {
    if (!selectedLevel || !module || !module.levels) {
      setSelectedLevel(null);
      setCurrentTasks([]);
      return;
    }

    // Сохраняем информацию о текущем уровне перед закрытием
    const closedLevelId = selectedLevel.id;
    const levels = module.levels;
    const currentLevelIndex = levels.findIndex((l) => l.id === closedLevelId);

    // Получаем актуальное состояние из store для проверки завершенности уровня
    const storeState = getStoreState();
    const updatedUserProgress = storeState.userProgress;
    const moduleProgress = getModuleProgress(moduleId, updatedUserProgress);
    const levelProgress = getLevelProgress(closedLevelId, moduleProgress);
    const wasCompleted = levelProgress?.isCompleted ?? false;

    // Закрываем текущий уровень
    setSelectedLevel(null);
    setCurrentTasks([]);

    // Если уровень был завершен и есть следующий уровень, открываем его
    if (
      wasCompleted &&
      currentLevelIndex >= 0 &&
      currentLevelIndex < levels.length - 1
    ) {
      const nextLevel = levels[currentLevelIndex + 1];
      if (nextLevel) {
        // Используем задержку для гарантированного закрытия предыдущего модального окна
        setTimeout(() => {
          // Используем requestAnimationFrame для гарантированного обновления DOM
          requestAnimationFrame(() => {
            // Получаем актуальное состояние из store после обновления
            const currentStoreState = getStoreState();
            const currentUserProgress = currentStoreState.userProgress;

            // Получаем актуальный прогресс модуля
            const updatedModuleProgress = getModuleProgress(
              moduleId,
              currentUserProgress
            );

            // Получаем прогресс следующего уровня (может быть undefined, если уровень еще не начинался)
            const nextLevelProgress = getLevelProgress(
              nextLevel.id,
              updatedModuleProgress
            );
            const tasks = getNextLevelTasks(
              nextLevel.taskPool,
              nextLevelProgress || { tasksProgress: [] },
              nextLevel.tasksPerLevel
            );

            // Открываем следующий уровень (это откроет новое модальное окно)
            setSelectedLevel(nextLevel);
            setCurrentTasks(tasks);
          });
        }, 150);
      }
    }
  };

  // Предотвращаем гидратацию, пока данные не загружены
  if (!isMounted || !module) {
    return (
      <div className="min-h-screen w-full bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-neutral-900 dark:text-white">
              {!isMounted ? t("loading") : t("moduleNotFound")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const moduleProgress = getModuleProgress(moduleId, userProgress);

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
            <Button
              onClick={() => router.push("/modules")}
              variant="ghost"
              className="mb-4 text-neutral-700 hover:bg-neutral-100 dark:text-white/70 dark:hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 size-4" />
              {t("backToModules")}
            </Button>
            <h1 className="text-4xl md:text-5xl font-semibold leading-[1.1] text-neutral-900 dark:text-white">
              {module.title}
            </h1>
            {module.description && (
              <p className="text-lg text-neutral-700 dark:text-white/70">
                {module.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Список уровней */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col gap-4">
            {module.levels.map((level, index) => {
              const levelProgress = getLevelProgress(level.id, moduleProgress);
              const isAvailable = isLevelAvailable(
                level,
                index,
                moduleProgress,
                module || undefined
              );
              const isCompleted = levelProgress?.isCompleted ?? false;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                >
                  <button
                    onClick={() => handleLevelClick(level, index)}
                    disabled={!isAvailable}
                    className={cn(
                      "group relative flex w-full items-center justify-between rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50",
                      isCompleted
                        ? "border-green-500/30 bg-green-50/50 dark:border-green-500/20 dark:bg-green-500/10"
                        : isAvailable
                        ? "border-black/10 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                        : "border-gray-300/50 bg-gray-100/50 dark:border-gray-700/50 dark:bg-gray-800/30"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex size-14 items-center justify-center rounded-xl text-xl font-bold shadow-md transition-all",
                          isCompleted
                            ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
                            : isAvailable
                            ? "bg-gradient-to-br from-sky-400 to-sky-500 text-white group-hover:from-sky-500 group-hover:to-sky-600"
                            : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="size-6" />
                        ) : isAvailable ? (
                          index + 1
                        ) : (
                          <Lock className="size-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {level.title || `${t("level")} ${index + 1}`}
                        </p>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-white/60">
                          {level.tasksPerLevel} {t("tasksCount")}
                        </p>
                      </div>
                    </div>
                    {isAvailable && (
                      <div className="text-neutral-400 transition-colors group-hover:text-neutral-600 dark:text-white/40 dark:group-hover:text-white/70">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedLevel && currentTasks.length > 0 && (
        <LevelStepper
          level={selectedLevel}
          tasks={currentTasks}
          onComplete={handleLevelComplete}
          onClose={handleStepperClose}
          onTaskAnswer={handleTaskAnswer}
          onTasksShuffle={handleTasksShuffle}
        />
      )}
    </div>
  );
}
