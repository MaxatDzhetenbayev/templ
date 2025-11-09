import { axiosApi } from "@/shared/lib/client/axios-client";

/**
 * Интерфейс для данных темы чата
 */
export interface TopicData {
  topic: string;
  level: string;
  title: string;
  description: string;
  startingPrompt: string;
  vocabulary: string[];
  grammarFocus: string[];
  estimatedDuration: number;
  status: "success" | "error";
}

/**
 * Интерфейс для сообщения чата
 */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Интерфейс для ответа чата
 */
export interface ChatResponse {
  message: string;
  success: boolean;
}

/**
 * Интерфейс для проверки грамматики
 */
export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  status: "success" | "error";
}

/**
 * Получить тему для практики
 *
 * @param topic - Тема модуля
 * @param level - Уровень сложности
 * @returns Данные темы
 */
export const getChatTopic = async (
  topic: string,
  level: "beginner" | "intermediate" | "advanced" = "beginner"
): Promise<TopicData> => {
  const response = await axiosApi.post<TopicData>("/chat/topic", {
    topic,
    level,
  });
  return response.data;
};

/**
 * Отправить сообщение в чат практики
 *
 * @param messages - История сообщений
 * @param topic - Тема модуля
 * @param language - Язык (kk, ru, en)
 * @param level - Уровень сложности
 * @returns Ответ ассистента
 */
export const sendChatMessage = async (
  messages: ChatMessage[],
  topic: string,
  language: "kk" | "ru" | "en" = "kk",
  level: "beginner" | "intermediate" | "advanced" = "beginner"
): Promise<ChatResponse> => {
  const response = await axiosApi.post<ChatResponse>("/chat/practice", {
    messages,
    topic,
    language,
    level,
  });
  return response.data;
};

/**
 * Проверить грамматику текста
 *
 * @param text - Текст для проверки
 * @param language - Язык (kk, ru, en)
 * @returns Результат проверки грамматики
 */
export const checkGrammar = async (
  text: string,
  language: "kk" | "ru" | "en" = "kk"
): Promise<GrammarCorrection> => {
  const response = await axiosApi.post<GrammarCorrection>("/chat/correct", {
    text,
    language,
  });
  return response.data;
};

