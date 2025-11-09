"use client";

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-blue-700">
        <div className="text-center">
          <p className="text-white text-xl">
            {!isMounted ? t("loading") : t("moduleNotFound")}
          </p>
        </div>
      </div>
    );
  }

  const moduleProgress = getModuleProgress(moduleId, userProgress);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-700 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button
            onClick={() => router.push("/modules")}
            variant="ghost"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 size-4" />
            {t("backToModules")}
          </Button>
          <h1 className="mb-2 text-3xl font-bold text-white">{module.title}</h1>
          <p className="text-white/90">{module.description}</p>
        </div>

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
              <button
                key={level.id}
                onClick={() => handleLevelClick(level, index)}
                disabled={!isAvailable}
                className={cn(
                  "flex items-center justify-between rounded-lg border-2 p-4 text-left transition-all",
                  isCompleted
                    ? "border-green-500 bg-green-500/20 text-white"
                    : isAvailable
                    ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                    : "border-gray-400/30 bg-gray-500/20 text-gray-300 cursor-not-allowed opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full text-xl font-bold",
                      isCompleted
                        ? "bg-green-500"
                        : isAvailable
                        ? "bg-white/20"
                        : "bg-gray-500/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-6 text-white" />
                    ) : isAvailable ? (
                      index + 1
                    ) : (
                      <Lock className="size-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {level.title || `${t("level")} ${index + 1}`}
                    </p>
                    <p className="text-sm opacity-80">
                      {level.tasksPerLevel} {t("tasksCount")}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

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
    </div>
  );
}
