import { z } from "zod";

/**
 * Типы заданий
 */
export const taskTypeSchema = z.enum([
  "missing-word",
  "listening",
  "riddle",
  "ai-chat",
]);

/**
 * Статус задания
 */
export const taskStatusSchema = z.enum(["locked", "available", "completed"]);

/**
 * Вариант ответа для задания
 */
export const answerOptionSchema = z.object({
  id: z.string(),
  text: z.string(), // Текст на казахском языке
  isCorrect: z.boolean(),
});

/**
 * Задание "Пропущенное слово"
 */
export const missingWordTaskSchema = z.object({
  id: z.string(),
  type: z.literal("missing-word"),
  sentence: z.string(), // Предложение на казахском с пропуском (обозначается как ___)
  options: z.array(answerOptionSchema).min(2),
  correctAnswerId: z.string(),
  points: z.number().positive().default(10),
});

/**
 * Задание "Аудирование"
 */
export const listeningTaskSchema = z.object({
  id: z.string(),
  type: z.literal("listening"),
  audioUrl: z.string().url(),
  question: z.string(), // Вопрос на языке пользователя
  options: z.array(answerOptionSchema).min(2),
  correctAnswerId: z.string(),
  points: z.number().positive().default(15),
});

/**
 * Задание "Загадка"
 */
export const riddleTaskSchema = z.object({
  id: z.string(),
  type: z.literal("riddle"),
  riddle: z.string(), // Загадка на языке пользователя
  options: z.array(answerOptionSchema).min(2),
  correctAnswerId: z.string(),
  points: z.number().positive().default(20),
});

/**
 * Задание "Чат с ИИ" (заглушка)
 */
export const aiChatTaskSchema = z.object({
  id: z.string(),
  type: z.literal("ai-chat"),
  topic: z.string(), // Тема модуля на языке пользователя
  points: z.number().positive().default(25),
});

/**
 * Объединенная схема задания
 */
export const taskSchema = z.discriminatedUnion("type", [
  missingWordTaskSchema,
  listeningTaskSchema,
  riddleTaskSchema,
  aiChatTaskSchema,
]);

/**
 * Статус выполнения задания пользователем
 */
export const taskProgressSchema = z.object({
  taskId: z.string(),
  status: taskStatusSchema,
  completedAt: z.string().optional(),
  score: z.number().nonnegative().optional(),
});

/**
 * Модуль обучения
 */
export const moduleSchema = z.object({
  id: z.string(),
  title: z.string(), // Название на языке пользователя
  description: z.string().optional(), // Описание на языке пользователя
  tasks: z.array(taskSchema).length(4), // Всегда 4 задания
  order: z.number().positive(),
});

/**
 * Прогресс пользователя по модулю
 */
export const moduleProgressSchema = z.object({
  moduleId: z.string(),
  tasksProgress: z.array(taskProgressSchema),
  completedAt: z.string().optional(),
  totalScore: z.number().nonnegative().default(0),
});

/**
 * Прогресс пользователя по всем модулям
 */
export const userProgressSchema = z.object({
  userId: z.string(),
  modulesProgress: z.array(moduleProgressSchema),
  totalPoints: z.number().nonnegative().default(0),
});

// Типы, выведенные из схем
export type TaskType = z.infer<typeof taskTypeSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type AnswerOption = z.infer<typeof answerOptionSchema>;
export type MissingWordTask = z.infer<typeof missingWordTaskSchema>;
export type ListeningTask = z.infer<typeof listeningTaskSchema>;
export type RiddleTask = z.infer<typeof riddleTaskSchema>;
export type AiChatTask = z.infer<typeof aiChatTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskProgress = z.infer<typeof taskProgressSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type ModuleProgress = z.infer<typeof moduleProgressSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;

