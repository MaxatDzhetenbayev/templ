"use client";

import React from "react";

import { useLearningTips } from "../hooks/use-learning-tips";

/**
 * Провайдер для показа периодических советов по изучению казахского языка
 *
 * @param interval - Интервал показа уведомлений в миллисекундах (по умолчанию 60000 = 1 минута)
 * @param enabled - Включены ли уведомления (по умолчанию true)
 */
export function LearningTipsProvider({
  interval = 60000,
  enabled = true,
}: {
  interval?: number;
  enabled?: boolean;
}): React.JSX.Element | null {
  useLearningTips(interval, enabled);

  // Компонент не рендерит ничего, только использует хук
  return null;
}

