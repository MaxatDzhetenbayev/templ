import type {
  Module,
  Level,
  Task,
  TaskStatus,
  ModuleProgress,
  LevelProgress,
} from "../schemas/learning.schema";

/**
 * Получает прогресс по модулю
 *
 * @param moduleId - ID модуля
 * @param userProgress - Прогресс пользователя
 * @returns Прогресс по модулю или undefined
 */
export const getModuleProgress = (
  moduleId: string,
  userProgress: { modulesProgress: ModuleProgress[] } | null
): ModuleProgress | undefined => {
  if (!userProgress || !userProgress.modulesProgress) return undefined;
  return userProgress.modulesProgress.find((mp) => mp.moduleId === moduleId);
};

/**
 * Получает прогресс по уровню
 *
 * @param levelId - ID уровня
 * @param moduleProgress - Прогресс по модулю
 * @returns Прогресс по уровню или undefined
 */
export const getLevelProgress = (
  levelId: string,
  moduleProgress: ModuleProgress | undefined
): LevelProgress | undefined => {
  if (!moduleProgress || !moduleProgress.levelsProgress) return undefined;
  return moduleProgress.levelsProgress.find((lp) => lp.levelId === levelId);
};

/**
 * Получает уровень по ID из модуля
 *
 * @param module - Модуль
 * @param levelId - ID уровня
 * @returns Уровень или undefined
 */
export const getLevelFromModule = (
  module: Module,
  levelId: string
): Level | undefined => {
  return module.levels.find((level) => level.id === levelId);
};

/**
 * Получает задание по ID из уровня
 *
 * @param level - Уровень
 * @param taskId - ID задания
 * @returns Задание или undefined
 */
export const getTaskFromLevel = (
  level: Level,
  taskId: string
): Task | undefined => {
  return level.taskPool.find((task) => task.id === taskId);
};

/**
 * Проверяет правильность ответа
 *
 * @param task - Задание
 * @param selectedAnswerId - Выбранный ответ
 * @returns true, если ответ правильный
 */
export const checkAnswer = (
  task: Task,
  selectedAnswerId: string
): boolean => {
  if (task.type === "ai-chat") {
    // Для чата с ИИ всегда возвращаем true (будет реализовано позже)
    return true;
  }

  if (task.type === "missing-word") {
    return task.correctAnswerId === selectedAnswerId;
  }

  if (task.type === "listening") {
    return task.correctAnswerId === selectedAnswerId;
  }

  if (task.type === "riddle") {
    return task.correctAnswerId === selectedAnswerId;
  }

  return false;
};

/**
 * Проверяет, доступен ли модуль для прохождения
 *
 * @param module - Модуль
 * @param moduleIndex - Индекс модуля в списке
 * @param allModules - Все модули (для проверки предыдущего)
 * @param userProgress - Прогресс пользователя
 * @returns true, если модуль доступен
 */
export const isModuleAvailable = (
  module: Module,
  moduleIndex: number,
  allModules: Module[],
  userProgress: { modulesProgress: ModuleProgress[] } | null
): boolean => {
  // Первый модуль всегда доступен
  if (moduleIndex === 0) return true;

  // Проверяем, завершен ли предыдущий модуль
  if (moduleIndex > 0) {
    const previousModule = allModules[moduleIndex - 1];
    if (previousModule) {
      const previousModuleProgress = getModuleProgress(
        previousModule.id,
        userProgress
      );
      return previousModuleProgress?.isCompleted ?? false;
    }
  }

  return false;
};

/**
 * Проверяет, доступен ли уровень для прохождения
 *
 * @param level - Уровень
 * @param levelIndex - Индекс уровня в модуле
 * @param moduleProgress - Прогресс по модулю
 * @returns true, если уровень доступен
 */
export const isLevelAvailable = (
  level: Level,
  levelIndex: number,
  moduleProgress: ModuleProgress | undefined
): boolean => {
  // Первый уровень всегда доступен
  if (levelIndex === 0) return true;

  // Проверяем, завершен ли предыдущий уровень
  if (!moduleProgress || !moduleProgress.levelsProgress) return false;

  const previousLevelProgress = moduleProgress.levelsProgress.find(
    (lp, idx) => idx === levelIndex - 1
  );

  return previousLevelProgress?.isCompleted ?? false;
};

/**
 * Вычисляет прогресс модуля в процентах
 *
 * @param module - Модуль
 * @param moduleProgress - Прогресс по модулю
 * @returns Процент выполнения (0-100)
 */
export const getModuleProgressPercent = (
  module: Module,
  moduleProgress: ModuleProgress | undefined
): number => {
  if (
    !moduleProgress ||
    !moduleProgress.levelsProgress ||
    module.levels.length === 0
  )
    return 0;

  const completedLevels = moduleProgress.levelsProgress.filter(
    (lp) => lp.isCompleted
  ).length;

  return Math.round((completedLevels / module.levels.length) * 100);
};
