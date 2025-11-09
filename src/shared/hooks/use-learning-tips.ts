"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { getCurrentUser } from "@/shared/lib/mock-auth";

import { getRandomTip, type LanguageCode } from "../consts/learning-tips.consts";

/**
 * Хук для показа периодических советов по изучению казахского языка
 *
 * @param interval - Интервал показа уведомлений в миллисекундах (по умолчанию 60000 = 1 минута)
 * @param enabled - Включены ли уведомления (по умолчанию true)
 */
export const useLearningTips = (
  interval: number = 60000,
  enabled: boolean = true
): void => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState(() => getCurrentUser());

  // Отслеживаем изменения авторизации через события localStorage
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    /**
     * Обработчик изменения localStorage
     */
    const handleStorageChange = (): void => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    // Слушаем события изменения localStorage
    window.addEventListener("storage", handleStorageChange);

    // Также проверяем изменения через polling (для изменений в том же окне)
    const checkInterval = setInterval(() => {
      const currentUser = getCurrentUser();
      if (currentUser?.id !== user?.id) {
        setUser(currentUser);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [user?.id]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    /**
     * Получает язык пользователя для показа советов
     *
     * @returns Код языка пользователя или null, если пользователь не авторизован
     */
    const getUserLanguage = (): LanguageCode | null => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return null;
      }
      if (currentUser.language) {
        const userLang = currentUser.language.toLowerCase();
        if (userLang === "kk" || userLang === "kazakh") return "kk";
        if (userLang === "en" || userLang === "english") return "en";
        if (userLang === "ru" || userLang === "russian") return "ru";
      }
      // По умолчанию используем русский язык
      return "ru";
    };

    /**
     * Показывает случайный совет
     */
    const showTip = (): void => {
      const language = getUserLanguage();
      // Показываем уведомление только если пользователь авторизован
      if (!language) {
        return;
      }

      const tip = getRandomTip(language);

      toast.info(tip, {
        duration: 5000,
        position: "bottom-right",
      });
    };

    // Проверяем авторизацию перед настройкой интервала
    if (!user) {
      // Очищаем интервал, если пользователь вышел
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Показываем первый совет сразу (опционально, можно убрать)
    // showTip();

    // Настраиваем интервал для показа советов
    intervalRef.current = setInterval(() => {
      showTip();
    }, interval);

    // Очищаем интервал при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, enabled, user]);
};

