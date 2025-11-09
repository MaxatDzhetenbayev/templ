import type {
  Module,
  Task,
  TaskProgress,
  TaskStatus,
  ModuleProgress,
} from "../schemas/learning.schema";

/**
 * Получает статус задания для пользователя
 *
 * @param taskId - ID задания
 * @param moduleProgress - Прогресс по модулю
 * @returns Статус задания
 */
export const getTaskStatus = (
  taskId: string,
  moduleProgress: ModuleProgress | undefined
): TaskStatus => {
  if (!moduleProgress) {
    // Первое задание всегда доступно
    return taskId === getFirstTaskId(moduleProgress) ? "available" : "locked";
  }

  const taskProgress = moduleProgress.tasksProgress.find(
    (tp) => tp.taskId === taskId
  );

  if (taskProgress) {
    return taskProgress.status;
  }

  // Проверяем, доступно ли задание (предыдущее должно быть завершено)
  return isTaskAvailable(taskId, moduleProgress) ? "available" : "locked";
};

/**
 * Получает ID первого задания в модуле
 *
 * @param moduleProgress - Прогресс по модулю (опционально)
 * @returns ID первого задания
 */
export const getFirstTaskId = (moduleProgress?: ModuleProgress): string => {
  // Временная заглушка, будет заменена при загрузке модулей
  return "task-1";
};

/**
 * Проверяет, доступно ли задание
 *
 * @param taskId - ID задания
 * @param moduleProgress - Прогресс по модулю
 * @returns true, если задание доступно
 */
export const isTaskAvailable = (
  taskId: string,
  moduleProgress: ModuleProgress
): boolean => {
  // Если задание уже завершено, оно доступно
  const taskProgress = moduleProgress.tasksProgress.find(
    (tp) => tp.taskId === taskId
  );
  if (taskProgress?.status === "completed") {
    return true;
  }

  // Первое задание всегда доступно
  // Для остальных нужно проверить, завершено ли предыдущее
  // Это упрощенная логика, в реальности нужно знать порядок заданий
  return true;
};

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
  if (!userProgress) return undefined;
  return userProgress.modulesProgress.find((mp) => mp.moduleId === moduleId);
};

/**
 * Получает задание по ID из модуля
 *
 * @param module - Модуль
 * @param taskId - ID задания
 * @returns Задание или undefined
 */
export const getTaskFromModule = (
  module: Module,
  taskId: string
): Task | undefined => {
  return module.tasks.find((task) => task.id === taskId);
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

