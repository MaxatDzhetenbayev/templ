import type { Task, TaskProgress } from "../schemas/learning.schema";

/**
 * Получает случайные задания из пула, исключая последнее показанное
 *
 * @param taskPool - Пул заданий для выбора
 * @param count - Количество заданий для выбора
 * @param lastTaskId - ID последнего показанного задания (для исключения)
 * @param completedTasks - Массив завершенных заданий (для исключения)
 * @returns Массив случайных заданий
 */
export function getRandomTasks(
  taskPool: Task[],
  count: number,
  lastTaskId?: string,
  completedTasks: TaskProgress[] = []
): Task[] {
  // Исключаем последнее задание и уже завершенные
  const excludedIds = new Set<string>();
  if (lastTaskId) {
    excludedIds.add(lastTaskId);
  }
  completedTasks.forEach((tp) => {
    if (tp.status === "completed") {
      excludedIds.add(tp.taskId);
    }
  });

  // Фильтруем доступные задания
  let availableTasks = taskPool.filter((task) => !excludedIds.has(task.id));

  // Если после фильтрации осталось меньше заданий, чем нужно,
  // добавляем исключенные обратно (кроме последнего)
  if (availableTasks.length < count) {
    availableTasks = taskPool.filter((task) => task.id !== lastTaskId);
  }

  // Если все равно недостаточно, берем все доступные
  if (availableTasks.length < count) {
    return availableTasks;
  }

  // Перемешиваем и берем нужное количество
  const shuffled = [...availableTasks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Получает следующее задание для уровня с учетом истории попыток
 *
 * @param taskPool - Пул заданий
 * @param levelProgress - Прогресс по уровню
 * @param tasksPerLevel - Количество заданий, которые нужно показать
 * @returns Массив заданий для текущей попытки
 */
export function getNextLevelTasks(
  taskPool: Task[],
  levelProgress: { tasksProgress: TaskProgress[] },
  tasksPerLevel: number
): Task[] {
  const lastTaskProgress = levelProgress.tasksProgress
    .filter((tp) => tp.lastAttemptedTaskId)
    .sort((a, b) => {
      const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return bTime - aTime;
    })[0];

  const lastTaskId = lastTaskProgress?.lastAttemptedTaskId;

  return getRandomTasks(
    taskPool,
    tasksPerLevel,
    lastTaskId,
    levelProgress.tasksProgress
  );
}

/**
 * Перемешивает задания для новой попытки (при ошибке)
 *
 * @param taskPool - Пул заданий
 * @param tasksPerLevel - Количество заданий
 * @returns Массив перемешанных заданий
 */
export function shuffleTasksForRetry(
  taskPool: Task[],
  tasksPerLevel: number
): Task[] {
  // Просто перемешиваем все задания из пула
  const shuffled = [...taskPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, tasksPerLevel);
}

