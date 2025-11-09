import { getCurrentUser } from "@/shared/lib/mock-auth";
import type { LocaleType } from "@/shared/types/locale.type";
import type { Module, UserProgress } from "../schemas/learning.schema";

/**
 * Мультиязычные данные для модулей
 */
interface LocalizedText {
  ru: string;
  en: string;
  kk: string;
}

interface LocalizedModuleData {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  color: string;
  order: number;
  levels: Array<{
    id: string;
    moduleId: string;
    order: number;
    title?: LocalizedText;
    tasksPerLevel: number;
    taskPool: Array<{
      id: string;
      type: "missing-word" | "listening" | "riddle" | "ai-chat";
      sentence?: string;
      audioUrl?: string;
      question?: LocalizedText;
      riddle?: LocalizedText;
      topic?: LocalizedText;
      options?: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>;
      correctAnswerId?: string;
      points: number;
    }>;
  }>;
}

/**
 * Моковые данные для модулей обучения с уровнями (мультиязычные)
 */
const mockModulesData: LocalizedModuleData[] = [
  {
    id: "module-1",
    title: {
      ru: "Приветствия и знакомство",
      en: "Greetings and acquaintance",
      kk: "Сәлемдесу және танысу",
    },
    description: {
      ru: "Изучите основы приветствия и знакомства на казахском языке",
      en: "Learn the basics of greetings and acquaintance in Kazakh",
      kk: "Қазақ тіліндегі сәлемдесу және танысу негіздерін үйреніңіз",
    },
    icon: "👋",
    color: "purple",
    order: 1,
    levels: [
      {
        id: "level-1-1",
        moduleId: "module-1",
        order: 1,
        tasksPerLevel: 4,
        taskPool: [
          {
            id: "task-1-1-1",
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
            id: "task-1-1-2",
            type: "missing-word",
            sentence: "Сәлеметсіз бе! Мен ___ .",
            options: [
              { id: "opt-1", text: "студентпін", isCorrect: true },
              { id: "opt-2", text: "мұғалімпін", isCorrect: false },
              { id: "opt-3", text: "дәрігерпін", isCorrect: false },
              { id: "opt-4", text: "инженерпін", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 10,
          },
          {
            id: "task-1-1-3",
            type: "listening",
            audioUrl: "/audio/greetings.mp3",
            question: {
              ru: "Выберите правильный вариант приветствия",
              en: "Choose the correct greeting option",
              kk: "Дұрыс сәлемдесу нұсқасын таңдаңыз",
            },
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
            id: "task-1-1-4",
            type: "riddle",
            riddle: {
              ru: "Какое приветствие говорят утром?",
              en: "What greeting is said in the morning?",
              kk: "Таңертең қандай сәлемдесу айтылады?",
            },
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
            id: "task-1-1-5",
            type: "missing-word",
            sentence: "Қайырлы ___ !",
            options: [
              { id: "opt-1", text: "таң", isCorrect: true },
              { id: "opt-2", text: "кеш", isCorrect: false },
              { id: "opt-3", text: "түн", isCorrect: false },
              { id: "opt-4", text: "күн", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 10,
          },
          {
            id: "task-1-1-6",
            type: "ai-chat",
            topic: {
              ru: "Приветствия и знакомство",
              en: "Greetings and acquaintance",
              kk: "Сәлемдесу және танысу",
            },
            points: 25,
          },
        ],
      },
      {
        id: "level-1-2",
        moduleId: "module-1",
        order: 2,
        tasksPerLevel: 4,
        taskPool: [
          {
            id: "task-1-2-1",
            type: "missing-word",
            sentence: "Сіз қалайсыз? Мен ___ .",
            options: [
              { id: "opt-1", text: "жақсымын", isCorrect: true },
              { id: "opt-2", text: "студентпін", isCorrect: false },
              { id: "opt-3", text: "қызықпын", isCorrect: false },
              { id: "opt-4", text: "әдемімін", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 10,
          },
          {
            id: "task-1-2-2",
            type: "listening",
            audioUrl: "/audio/greetings-2.mp3",
            question: {
              ru: "Выберите правильный ответ на вопрос 'Как дела?'",
              en: "Choose the correct answer to the question 'How are you?'",
              kk: "'Қалайсыз?' сұрағына дұрыс жауапты таңдаңыз",
            },
            options: [
              { id: "opt-1", text: "Рақмет, жақсы", isCorrect: true },
              { id: "opt-2", text: "Сау болыңыз", isCorrect: false },
              { id: "opt-3", text: "Кешіріңіз", isCorrect: false },
              { id: "opt-4", text: "Білмеймін", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 15,
          },
          {
            id: "task-1-2-3",
            type: "riddle",
            riddle: {
              ru: "Какое слово говорят при прощании?",
              en: "What word is said when saying goodbye?",
              kk: "Қоштасқанда қандай сөз айтылады?",
            },
            options: [
              { id: "opt-1", text: "Сау болыңыз", isCorrect: true },
              { id: "opt-2", text: "Сәлеметсіз бе", isCorrect: false },
              { id: "opt-3", text: "Рақмет", isCorrect: false },
              { id: "opt-4", text: "Қайырлы таң", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 20,
          },
          {
            id: "task-1-2-4",
            type: "ai-chat",
            topic: {
              ru: "Приветствия и знакомство",
              en: "Greetings and acquaintance",
              kk: "Сәлемдесу және танысу",
            },
            points: 25,
          },
        ],
      },
    ],
  },
  {
    id: "module-2",
    title: {
      ru: "Семья и друзья",
      en: "Family and friends",
      kk: "Отбасы және достар",
    },
    description: {
      ru: "Изучите слова и фразы о семье и друзьях",
      en: "Learn words and phrases about family and friends",
      kk: "Отбасы және достар туралы сөздер мен сөйлемдерді үйреніңіз",
    },
    icon: "👨‍👩‍👧‍👦",
    color: "yellow",
    order: 2,
    levels: [
      {
        id: "level-2-1",
        moduleId: "module-2",
        order: 1,
        tasksPerLevel: 4,
        taskPool: [
          {
            id: "task-2-1-1",
            type: "missing-word",
            sentence: "Менің ___ қарындасым бар.",
            options: [
              { id: "opt-1", text: "бір", isCorrect: true },
              { id: "opt-2", text: "екі", isCorrect: false },
              { id: "opt-3", text: "үш", isCorrect: false },
              { id: "opt-4", text: "төрт", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 10,
          },
          {
            id: "task-2-1-2",
            type: "listening",
            audioUrl: "/audio/family.mp3",
            question: {
              ru: "Выберите правильный вариант",
              en: "Choose the correct option",
              kk: "Дұрыс нұсқаны таңдаңыз",
            },
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
            id: "task-2-1-3",
            type: "riddle",
            riddle: {
              ru: "Кто родил тебя на свет?",
              en: "Who gave birth to you?",
              kk: "Сені кім туған?",
            },
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
            id: "task-2-1-4",
            type: "missing-word",
            sentence: "Менің ___ отбасым бар.",
            options: [
              { id: "opt-1", text: "үлкен", isCorrect: true },
              { id: "opt-2", text: "кіші", isCorrect: false },
              { id: "opt-3", text: "студент", isCorrect: false },
              { id: "opt-4", text: "мұғалім", isCorrect: false },
            ],
            correctAnswerId: "opt-1",
            points: 10,
          },
          {
            id: "task-2-1-5",
            type: "ai-chat",
            topic: {
              ru: "Семья и друзья",
              en: "Family and friends",
              kk: "Отбасы және достар",
            },
            points: 25,
          },
        ],
      },
    ],
  },
  {
    id: "module-3",
    title: {
      ru: "Еда и напитки",
      en: "Food and drinks",
      kk: "Тағам және сусындар",
    },
    description: {
      ru: "Изучите названия еды и напитков на казахском",
      en: "Learn the names of food and drinks in Kazakh",
      kk: "Қазақ тіліндегі тағам мен сусындардың атауларын үйреніңіз",
    },
    icon: "🍔",
    color: "orange",
    order: 3,
    levels: [
      {
        id: "level-3-1",
        moduleId: "module-3",
        order: 1,
        tasksPerLevel: 4,
        taskPool: [
          {
            id: "task-3-1-1",
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
            id: "task-3-1-2",
            type: "listening",
            audioUrl: "/audio/food.mp3",
            question: {
              ru: "Выберите правильный вариант",
              en: "Choose the correct option",
              kk: "Дұрыс нұсқаны таңдаңыз",
            },
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
            id: "task-3-1-3",
            type: "riddle",
            riddle: {
              ru: "Что пекут в печи?",
              en: "What is baked in the oven?",
              kk: "Пеште не пісіріледі?",
            },
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
            id: "task-3-1-4",
            type: "missing-word",
            sentence: "Мен ___ жедім.",
            options: [
              { id: "opt-1", text: "нан", isCorrect: false },
              { id: "opt-2", text: "сүт", isCorrect: false },
              { id: "opt-3", text: "ет", isCorrect: true },
              { id: "opt-4", text: "көкөніс", isCorrect: false },
            ],
            correctAnswerId: "opt-3",
            points: 10,
          },
          {
            id: "task-3-1-5",
            type: "ai-chat",
            topic: {
              ru: "Еда и напитки",
              en: "Food and drinks",
              kk: "Тағам және сусындар",
            },
            points: 25,
          },
        ],
      },
    ],
  },
];

/**
 * Преобразует мультиязычные данные модулей в локализованные модули
 *
 * @param locale - Локаль для получения переводов
 * @returns Массив локализованных модулей
 */
export const getLocalizedModules = (locale: LocaleType[number]): Module[] => {
  return mockModulesData.map((moduleData) => ({
    id: moduleData.id,
    title: moduleData.title[locale] || moduleData.title.ru,
    description: moduleData.description[locale] || moduleData.description.ru,
    icon: moduleData.icon,
    color: moduleData.color,
    order: moduleData.order,
    levels: moduleData.levels.map((levelData) => ({
      id: levelData.id,
      moduleId: levelData.moduleId,
      order: levelData.order,
      title: levelData.title
        ? levelData.title[locale] || levelData.title.ru
        : undefined,
      tasksPerLevel: levelData.tasksPerLevel,
      taskPool: levelData.taskPool.map((taskData) => {
        if (taskData.type === "missing-word") {
          return {
            id: taskData.id,
            type: "missing-word" as const,
            sentence: taskData.sentence || "",
            options: taskData.options || [],
            correctAnswerId: taskData.correctAnswerId || "",
            points: taskData.points,
          };
        }

        if (taskData.type === "listening") {
          return {
            id: taskData.id,
            type: "listening" as const,
            audioUrl: taskData.audioUrl || "",
            question: taskData.question
              ? taskData.question[locale] || taskData.question.ru
              : "",
            options: taskData.options || [],
            correctAnswerId: taskData.correctAnswerId || "",
            points: taskData.points,
          };
        }

        if (taskData.type === "riddle") {
          return {
            id: taskData.id,
            type: "riddle" as const,
            riddle: taskData.riddle
              ? taskData.riddle[locale] || taskData.riddle.ru
              : "",
            options: taskData.options || [],
            correctAnswerId: taskData.correctAnswerId || "",
            points: taskData.points,
          };
        }

        if (taskData.type === "ai-chat") {
          return {
            id: taskData.id,
            type: "ai-chat" as const,
            topic: taskData.topic
              ? taskData.topic[locale] || taskData.topic.ru
              : "",
            points: taskData.points,
          };
        }

        // Fallback (не должно произойти)
        throw new Error(`Unknown task type: ${taskData.type}`);
      }),
    })),
  }));
};

/**
 * @deprecated Используйте getLocalizedModules вместо этого
 * Моковые данные для модулей обучения с уровнями
 */
export const mockModules: Module[] = getLocalizedModules("ru");

const PROGRESS_STORAGE_KEY = "learning_user_progress";

/**
 * Тип для хранения прогресса всех пользователей
 */
type AllUsersProgress = Record<string, UserProgress>;

/**
 * Получает весь прогресс всех пользователей из localStorage
 */
const getAllUsersProgress = (): AllUsersProgress => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!stored) return {};
  try {
    // Проверяем, старый ли формат (один объект UserProgress)
    const parsed = JSON.parse(stored);
    // Если это старый формат (есть userId и modulesProgress напрямую)
    if (parsed.userId && Array.isArray(parsed.modulesProgress)) {
      // Мигрируем в новый формат
      const oldProgress = parsed as UserProgress;
      const newFormat: AllUsersProgress = {
        [oldProgress.userId]: oldProgress,
      };
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newFormat));
      return newFormat;
    }
    // Новый формат (объект с ключами userId)
    return parsed as AllUsersProgress;
  } catch {
    return {};
  }
};

/**
 * Сохраняет весь прогресс всех пользователей в localStorage
 */
const saveAllUsersProgress = (allProgress: AllUsersProgress): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
};

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

  // Получаем весь прогресс всех пользователей
  const allProgress = getAllUsersProgress();

  // Проверяем, есть ли прогресс для текущего пользователя
  if (allProgress[user.id]) {
    return allProgress[user.id];
  }

  // Создаем новый прогресс
  const newProgress: UserProgress = {
    userId: user.id,
    modulesProgress: [],
    totalPoints: 0,
  };

  // Сохраняем новый прогресс
  allProgress[user.id] = newProgress;
  saveAllUsersProgress(allProgress);

  return newProgress;
};

/**
 * Сохраняет прогресс пользователя в localStorage
 */
export const saveMockUserProgress = (progress: UserProgress): void => {
  if (typeof window === "undefined") return;

  // Получаем весь прогресс
  const allProgress = getAllUsersProgress();

  // Обновляем прогресс текущего пользователя
  allProgress[progress.userId] = progress;

  // Сохраняем обратно
  saveAllUsersProgress(allProgress);
};

/**
 * Получает прогресс конкретного пользователя по его ID
 */
export const getUserProgressById = (userId: string): UserProgress | null => {
  if (typeof window === "undefined") return null;
  const allProgress = getAllUsersProgress();
  return allProgress[userId] || null;
};

/**
 * Получает прогресс всех пользователей
 */
export const getAllUsersProgressData = (): AllUsersProgress => {
  return getAllUsersProgress();
};
