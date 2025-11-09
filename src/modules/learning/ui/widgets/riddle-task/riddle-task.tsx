"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import React, { useState } from "react";
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
import { cn } from "@/shared/lib/utils";

import type { RiddleTask } from "../../../schemas/learning.schema";
import { checkAnswer } from "../../../utils/learning.utils";

export interface RiddleTaskProps {
  task: RiddleTask;
  explanation: string; // Объяснение на языке пользователя
  onComplete: (isCorrect: boolean, points: number) => void;
  onClose: () => void;
}

/**
 * Виджет задания "Загадка"
 *
 * @param task - Задание типа "загадка"
 * @param explanation - Объяснение задания на языке пользователя
 * @param onComplete - Обработчик завершения задания
 * @param onClose - Обработчик закрытия модального окна
 */
export function RiddleTaskWidget({
  task,
  explanation,
  onComplete,
  onClose,
}: RiddleTaskProps): React.JSX.Element {
  const t = useTranslations("learning");
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(
    null
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswerId) return;

    const correct = checkAnswer(task, selectedAnswerId);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    // Закрываем только если задание было проверено
    if (!isSubmitted) {
      // Если задание еще не было проверено, просто закрываем без вызова onComplete
      onClose();
      return;
    }

    if (isCorrect) {
      // Вызываем onComplete только при закрытии после правильного ответа
      // Важно: сначала закрываем модальное окно, затем обрабатываем завершение
      onClose();
      // Используем setTimeout для гарантии, что onComplete вызовется после закрытия
      setTimeout(() => {
        onComplete(true, task.points);
      }, 0);
    } else {
      // При неправильном ответе просто закрываем без вызова onComplete
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={(open) => {
      if (!open) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("taskTitles.riddle")}</DialogTitle>
          <DialogDescription>{explanation}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("taskTitles.riddle")}
              </h3>
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-200">
              {task.riddle}
            </p>
          </div>

          {!isSubmitted ? (
            <div>
              <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t("messages.selectAnswer")}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {task.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAnswerId(option.id)}
                    className={cn(
                      "rounded-lg border-2 p-4 text-left transition-all",
                      selectedAnswerId === option.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 dark:border-gray-700 hover:border-primary/50"
                    )}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {task.options.map((option) => {
                const isSelected = option.id === selectedAnswerId;
                const isCorrectOption = option.isCorrect;

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "rounded-lg border-2 p-4",
                      isCorrectOption
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isSelected && !isCorrectOption
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-gray-300 dark:border-gray-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {option.text}
                      </span>
                      {isCorrectOption && (
                        <CheckCircle2 className="size-5 text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswerId}
              className="w-full sm:w-auto"
            >
              {t("buttons.check")}
            </Button>
          ) : isCorrect ? (
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-6" />
                <span className="text-lg font-semibold">
                  {t("messages.success", { points: task.points })}
                </span>
              </div>
              <Button onClick={handleClose} className="w-full sm:w-auto">
                {t("buttons.close")}
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="size-6" />
                <span className="text-lg font-semibold">
                  {t("messages.error")}
                </span>
              </div>
              <Button onClick={onClose} variant="destructive" className="w-full sm:w-auto">
                {t("buttons.close")}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

