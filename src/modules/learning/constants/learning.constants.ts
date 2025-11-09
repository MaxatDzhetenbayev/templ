import type { TaskType } from "../schemas/learning.schema";

/**
 * Константы для модуля обучения
 */

/**
 * Типы заданий с их метаданными
 */
export const TASK_TYPES: Record<
  TaskType,
  {
    label: string; // Ключ для локализации (без префикса "learning")
    icon: string; // Название иконки из lucide-react
    color: string; // Цвет для UI
  }
> = {
  "missing-word": {
    label: "tasks.missingWord",
    icon: "FileText",
    color: "green",
  },
  listening: {
    label: "tasks.listening",
    icon: "Mic",
    color: "blue",
  },
  riddle: {
    label: "tasks.riddle",
    icon: "Lightbulb",
    color: "yellow",
  },
  "ai-chat": {
    label: "tasks.aiChat",
    icon: "MessageSquare",
    color: "purple",
  },
};

/**
 * Статусы заданий с их визуальными представлениями
 */
export const TASK_STATUS = {
  locked: {
    icon: "Lock",
    color: "yellow",
    bgColor: "bg-white dark:bg-card",
  },
  available: {
    icon: "FileText",
    color: "gray",
    bgColor: "bg-white dark:bg-card",
  },
  completed: {
    icon: "Check",
    color: "green",
    bgColor: "bg-green-500",
  },
} as const;

/**
 * Баллы за задания по типам
 */
export const TASK_POINTS: Record<TaskType, number> = {
  "missing-word": 10,
  listening: 15,
  riddle: 20,
  "ai-chat": 25,
};

