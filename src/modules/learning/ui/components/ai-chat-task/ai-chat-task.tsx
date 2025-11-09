"use client";

import { CheckCircle2, Loader2, MessageSquare, Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import { Button, Input } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";

import type { AiChatTask } from "../../../schemas/learning.schema";
import {
  checkGrammar,
  getChatTopic,
  sendChatMessage,
  type ChatMessage,
  type GrammarCorrection,
  type TopicData,
} from "../../../lib/chat-api";

export interface AiChatTaskProps {
  task: AiChatTask;
  onComplete: () => void;
}

/**
 * Компонент задания "Чат с ИИ"
 *
 * @param task - Задание типа ai-chat
 * @param onComplete - Обработчик завершения задания
 */
export function AiChatTask({
  task,
  onComplete,
}: AiChatTaskProps): React.JSX.Element {
  const t = useTranslations("learning");
  const locale = useLocale();
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingTopic, setIsLoadingTopic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grammarCorrection, setGrammarCorrection] =
    useState<GrammarCorrection | null>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Маппинг локали на язык для API
  const getLanguageCode = (): "kk" | "ru" | "en" => {
    if (locale === "kk") return "kk";
    if (locale === "en") return "en";
    return "ru";
  };

  // Определяем уровень сложности (можно улучшить, добавив в задание)
  const getLevel = (): "beginner" | "intermediate" | "advanced" => {
    return "beginner";
  };

  // Загружаем тему при монтировании
  useEffect(() => {
    const loadTopic = async () => {
      setIsLoadingTopic(true);
      setError(null);
      try {
        const data = await getChatTopic(task.topic, getLevel());
        if (data.status === "success") {
          setTopicData(data);
          // Инициируем чат стартовым сообщением
          const initialMessage: ChatMessage = {
            role: "assistant",
            content: data.startingPrompt,
          };
          setMessages([initialMessage]);
        } else {
          setError(t("messages.aiChatError"));
        }
      } catch (err) {
        console.error("Error loading topic:", err);
        setError(t("messages.aiChatError"));
      } finally {
        setIsLoadingTopic(false);
      }
    };

    loadTopic();
  }, [task.topic, t]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Отправка сообщения
  const handleSend = async () => {
    if (!inputValue.trim() || isSending || !topicData) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsSending(true);
    setError(null);

    try {
      const response = await sendChatMessage(
        newMessages,
        topicData.topic,
        getLanguageCode(),
        getLevel()
      );

      if (response.success) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response.message,
        };
        setMessages([...newMessages, assistantMessage]);
      } else {
        setError(t("messages.aiChatError"));
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(t("messages.aiChatError"));
    } finally {
      setIsSending(false);
    }
  };

  // Проверка грамматики
  const handleCheckGrammar = async () => {
    if (!inputValue.trim() || isCheckingGrammar) return;

    setIsCheckingGrammar(true);
    setError(null);

    try {
      const correction = await checkGrammar(inputValue.trim(), getLanguageCode());
      setGrammarCorrection(correction);
    } catch (err) {
      console.error("Error checking grammar:", err);
      setError(t("messages.aiChatError"));
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  // Завершение задания
  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  // Обработка Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingTopic) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-gray-600 dark:text-gray-400">
          {t("messages.aiChatLoading")}
        </p>
      </div>
    );
  }

  if (error && !topicData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={() => window.location.reload()}>
          {t("buttons.check")}
        </Button>
      </div>
    );
  }

  if (!topicData) return <div />;

  return (
    <div className="flex h-[500px] flex-col space-y-4">
      {/* Заголовок и описание */}
      <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-4">
        <div className="mb-2 flex items-center gap-2">
          <MessageSquare className="size-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {topicData.title}
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {topicData.description}
        </p>
        {topicData.vocabulary.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
              Словарь: {topicData.vocabulary.join(", ")}
            </p>
          </div>
        )}
      </div>

      {/* История сообщений */}
      <div className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2">
              <Loader2 className="size-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Проверка грамматики */}
      {grammarCorrection && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t("messages.aiChatGrammarTitle")}
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {t("messages.aiChatGrammarOriginal")}
              </span>
              <p className="text-gray-900 dark:text-gray-100">
                {grammarCorrection.original}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {t("messages.aiChatGrammarCorrected")}
              </span>
              <p className="text-green-600 dark:text-green-400">
                {grammarCorrection.corrected}
              </p>
            </div>
            {grammarCorrection.explanation && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {t("messages.aiChatGrammarExplanation")}
                </span>
                <p className="text-gray-700 dark:text-gray-300">
                  {grammarCorrection.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Поле ввода */}
      {!isCompleted && (
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("messages.aiChatPlaceholderInput")}
            disabled={isSending || isCheckingGrammar}
            className="flex-1"
          />
          <Button
            onClick={handleCheckGrammar}
            variant="outline"
            disabled={!inputValue.trim() || isSending || isCheckingGrammar}
            size="sm"
          >
            {isCheckingGrammar ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              t("messages.aiChatCheckGrammar")
            )}
          </Button>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending || isCheckingGrammar}
            size="sm"
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="mr-2 size-4" />
                {t("messages.aiChatSend")}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Кнопка завершения */}
      {!isCompleted && messages.length >= 2 && (
        <Button
          onClick={handleComplete}
          className="w-full"
          disabled={isSending || isCheckingGrammar}
        >
          <CheckCircle2 className="mr-2 size-4" />
          {t("messages.aiChatComplete")}
        </Button>
      )}

      {/* Сообщение о завершении */}
      {isCompleted && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 p-4">
          <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
            {t("messages.success", { points: task.points || 0 })}
          </span>
        </div>
      )}
    </div>
  );
}

