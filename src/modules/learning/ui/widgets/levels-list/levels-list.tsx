"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, Lock } from "lucide-react";

import { useRouter } from "@/shared/configs/i18/navigation";

import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";

import { LevelStepper } from "../../widgets";
import { useLearningStore } from "../../../model/learning.store";
import { mockModules } from "../../../utils/mock-data";
import { getNextLevelTasks } from "../../../utils/task-randomizer";
import type { Module, Level, Task } from "../../../schemas/learning.schema";
import {
  getModuleProgress,
  getLevelProgress,
  isLevelAvailable,
} from "../../../utils/learning.utils";

/**
 * Виджет списка уровней модуля
 */
export function LevelsList(): React.JSX.Element {
  const t = useTranslations("learning");
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const {
    modules,
    userProgress,
    setModules,
    completeLevel,
    addPoints,
    subtractPoints,
  } = useLearningStore();

  // Получаем функцию для доступа к актуальному состоянию store
  const getStoreState = useLearningStore.getState;

  const [module, setModule] = useState<Module | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);

  // Загружаем модули и находим нужный
  useEffect(() => {
    setIsMounted(true);
    if (modules.length === 0) {
      setModules(mockModules);
    }
    const foundModule = modules.find((m) => m.id === moduleId);
    if (foundModule) {
      setModule(foundModule);
    } else if (mockModules.length > 0) {
      const mockModule = mockModules.find((m) => m.id === moduleId);
      if (mockModule) setModule(mockModule);
    }
  }, [moduleId, modules, setModules]);

  const handleLevelClick = (level: Level, levelIndex: number) => {
    const moduleProgress = getModuleProgress(moduleId, userProgress);
    const isAvailable = isLevelAvailable(level, levelIndex, moduleProgress);

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

  const handleTaskAnswer = (isCorrect: boolean, points: number) => {
    if (!selectedLevel || !module) return;

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

    // Сохраняем ID завершенного уровня и данные модуля перед сбросом состояния
    const completedLevelId = selectedLevel.id;
    const levels = module.levels;
    const currentLevelIndex = levels.findIndex(
      (l) => l.id === completedLevelId
    );

    // Завершаем уровень
    completeLevel(moduleId, completedLevelId);
    setSelectedLevel(null);
    setCurrentTasks([]);

    // Открываем следующий уровень, если он есть
    if (currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1) {
      const nextLevel = levels[currentLevelIndex + 1];
      if (nextLevel) {
        // Небольшая задержка для плавного перехода и получения актуального состояния
        setTimeout(() => {
          // Получаем актуальное состояние из store
          const storeState = getStoreState();
          const updatedUserProgress = storeState.userProgress;
          
          // Проверяем доступность следующего уровня с актуальным прогрессом
          const moduleProgress = getModuleProgress(moduleId, updatedUserProgress);
          const nextLevelIndex = currentLevelIndex + 1;
          const isAvailable = isLevelAvailable(nextLevel, nextLevelIndex, moduleProgress);

          if (isAvailable) {
            const levelProgress = getLevelProgress(nextLevel.id, moduleProgress);
            const tasks = getNextLevelTasks(
              nextLevel.taskPool,
              levelProgress || { tasksProgress: [] },
              nextLevel.tasksPerLevel
            );

            setSelectedLevel(nextLevel);
            setCurrentTasks(tasks);
          }
        }, 500);
      }
    }
  };

  const handleStepperClose = () => {
    setSelectedLevel(null);
    setCurrentTasks([]);
  };


  // Предотвращаем гидратацию, пока данные не загружены
  if (!isMounted || !module) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-purple-600 to-blue-700">
        <div className="text-center">
          <p className="text-white text-xl">
            {!isMounted ? t("loading") || "Загрузка..." : "Модуль не найден"}
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
            Назад к модулям
          </Button>
          <h1 className="mb-2 text-3xl font-bold text-white">{module.title}</h1>
          <p className="text-white/90">{module.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          {module.levels.map((level, index) => {
            const levelProgress = getLevelProgress(level.id, moduleProgress);
            const isAvailable = isLevelAvailable(level, index, moduleProgress);
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
                      {level.title || `Уровень ${index + 1}`}
                    </p>
                    <p className="text-sm opacity-80">
                      {level.tasksPerLevel} заданий
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

