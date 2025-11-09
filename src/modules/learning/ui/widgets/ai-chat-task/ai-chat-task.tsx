"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";

import type { AiChatTask } from "../../../schemas/learning.schema";

export interface AiChatTaskProps {
  task: AiChatTask;
  explanation: string; // Объяснение на языке пользователя
  onClose: () => void;
}

/**
 * Виджет задания "Чат с ИИ" (заглушка)
 *
 * @param task - Задание типа "чат с ИИ"
 * @param explanation - Объяснение задания на языке пользователя
 * @param onClose - Обработчик закрытия модального окна
 */
export function AiChatTaskWidget({
  task,
  explanation,
  onClose,
}: AiChatTaskProps): React.JSX.Element {
  const t = useTranslations("learning");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("taskTitles.aiChat")}</DialogTitle>
          <DialogDescription>{explanation}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-6 text-center">
            <p className="text-lg text-gray-800 dark:text-gray-200">
              {t("messages.aiChatPlaceholder")}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t("taskTitles.aiChat")}: {task.topic}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            {t("buttons.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

