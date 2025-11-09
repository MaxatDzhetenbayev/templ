import type { Module, UserProgress } from "../schemas/learning.schema";
import { getCurrentUser } from "@/shared/lib/mock-auth";

/**
 * Моковые данные для модулей обучения
 */
export const mockModules: Module[] = [
  {
    id: "module-1",
    title: "Приветствия и знакомство",
    description: "Изучите основы приветствия и знакомства на казахском языке",
    order: 1,
    tasks: [
      {
        id: "task-1-1",
        type: "missing-word",
        sentence: "Сәлем! Менің атым ___ .",
        options: [
          { id: "opt-1", text: "Айжан", isCorrect: true },
          { id: "opt-2", text: "Алматы", isCorrect: false },
          { id: "opt-3", text: "қазақша", isCorrect: false },
          { id: "opt-4", text: "жақсы", isCorrect: false },
        ],
        correctAnswerId: "opt-1",
        points: 10,
      },
      {
        id: "task-1-2",
        type: "listening",
        audioUrl: "/audio/greetings.mp3",
        question: "Выберите правильный вариант приветствия",
        options: [
          { id: "opt-1", text: "Сәлеметсіз бе", isCorrect: true },
          { id: "opt-2", text: "Сау болыңыз", isCorrect: false },
          { id: "opt-3", text: "Рахмет", isCorrect: false },
          { id: "opt-4", text: "Кешіріңіз", isCorrect: false },
        ],
        correctAnswerId: "opt-1",
        points: 15,
      },
      {
        id: "task-1-3",
        type: "riddle",
        riddle: "Это слово используется для приветствия утром",
        options: [
          { id: "opt-1", text: "Қайырлы таң", isCorrect: true },
          { id: "opt-2", text: "Қайырлы кеш", isCorrect: false },
          { id: "opt-3", text: "Қайырлы түн", isCorrect: false },
          { id: "opt-4", text: "Қайырлы күн", isCorrect: false },
        ],
        correctAnswerId: "opt-1",
        points: 20,
      },
      {
        id: "task-1-4",
        type: "ai-chat",
        topic: "Приветствия и знакомство",
        points: 25,
      },
    ],
  },
  {
    id: "module-2",
    title: "Семья и друзья",
    description: "Изучите слова и фразы о семье и друзьях",
    order: 2,
    tasks: [
      {
        id: "task-2-1",
        type: "missing-word",
        sentence: "Менің ___ екі бауырым бар.",
        options: [
          { id: "opt-1", text: "ата-ана", isCorrect: false },
          { id: "opt-2", text: "отбасы", isCorrect: false },
          { id: "opt-3", text: "қарындасы", isCorrect: true },
          { id: "opt-4", text: "дос", isCorrect: false },
        ],
        correctAnswerId: "opt-3",
        points: 10,
      },
      {
        id: "task-2-2",
        type: "listening",
        audioUrl: "/audio/family.mp3",
        question: "Выберите правильный вариант",
        options: [
          { id: "opt-1", text: "Әке", isCorrect: true },
          { id: "opt-2", text: "Ана", isCorrect: false },
          { id: "opt-3", text: "Аға", isCorrect: false },
          { id: "opt-4", text: "Апа", isCorrect: false },
        ],
        correctAnswerId: "opt-1",
        points: 15,
      },
      {
        id: "task-2-3",
        type: "riddle",
        riddle: "Это слово означает 'мама' на казахском",
        options: [
          { id: "opt-1", text: "Әке", isCorrect: false },
          { id: "opt-2", text: "Ана", isCorrect: true },
          { id: "opt-3", text: "Аға", isCorrect: false },
          { id: "opt-4", text: "Апа", isCorrect: false },
        ],
        correctAnswerId: "opt-2",
        points: 20,
      },
      {
        id: "task-2-4",
        type: "ai-chat",
        topic: "Семья и друзья",
        points: 25,
      },
    ],
  },
  {
    id: "module-3",
    title: "Еда и напитки",
    description: "Изучите названия еды и напитков на казахском",
    order: 3,
    tasks: [
      {
        id: "task-3-1",
        type: "missing-word",
        sentence: "Мен ___ ішемін.",
        options: [
          { id: "opt-1", text: "нан", isCorrect: false },
          { id: "opt-2", text: "сүт", isCorrect: true },
          { id: "opt-3", text: "ет", isCorrect: false },
          { id: "opt-4", text: "көкөніс", isCorrect: false },
        ],
        correctAnswerId: "opt-2",
        points: 10,
      },
      {
        id: "task-3-2",
        type: "listening",
        audioUrl: "/audio/food.mp3",
        question: "Выберите правильный вариант",
        options: [
          { id: "opt-1", text: "Ет", isCorrect: true },
          { id: "opt-2", text: "Балық", isCorrect: false },
          { id: "opt-3", text: "Қуырылған", isCorrect: false },
          { id: "opt-4", text: "Тұз", isCorrect: false },
        ],
        correctAnswerId: "opt-1",
        points: 15,
      },
      {
        id: "task-3-3",
        type: "riddle",
        riddle: "Это слово означает 'хлеб' на казахском",
        options: [
          { id: "opt-1", text: "Нан", isCorrect: true },
          { id: "opt-2", text: "Сүт", isCorrect: false },
          { id: "opt-3", text: "Ет", isCorrect: false },
          { id: "opt-4", text: "Су", isCorrect: false },
        ],
        correctAnswerId: "opt-1",
        points: 20,
      },
      {
        id: "task-3-4",
        type: "ai-chat",
        topic: "Еда и напитки",
        points: 25,
      },
    ],
  },
];

const PROGRESS_STORAGE_KEY = "learning_user_progress";

/**
 * Получает моковый прогресс пользователя из localStorage или создает новый
 */
export const getMockUserProgress = (): UserProgress => {
  if (typeof window === "undefined") {
    return {
      userId: "",
      modulesProgress: [],
      totalPoints: 0,
    };
  }

  const user = getCurrentUser();
  if (!user) {
    return {
      userId: "",
      modulesProgress: [],
      totalPoints: 0,
    };
  }

  // Пытаемся загрузить сохраненный прогресс
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (stored) {
    try {
      const progress = JSON.parse(stored) as UserProgress;
      // Проверяем, что прогресс принадлежит текущему пользователю
      if (progress.userId === user.id) {
        return progress;
      }
    } catch {
      // Игнорируем ошибки парсинга
    }
  }

  // Создаем новый прогресс
  return {
    userId: user.id,
    modulesProgress: [],
    totalPoints: 0,
  };
};

/**
 * Сохраняет прогресс пользователя в localStorage
 */
export const saveMockUserProgress = (progress: UserProgress): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

