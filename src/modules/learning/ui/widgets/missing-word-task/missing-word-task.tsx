"use client";

import { CheckCircle2 } from "lucide-react";
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

import type { MissingWordTask } from "../../../schemas/learning.schema";
import { checkAnswer } from "../../../utils/learning.utils";

export interface MissingWordTaskProps {
  task: MissingWordTask;
  explanation: string; // Объяснение на языке пользователя
  onComplete: (isCorrect: boolean, points: number) => void;
  onClose: () => void;
}

/**
 * Виджет задания "Пропущенное слово"
 *
 * @param task - Задание типа "пропущенное слово"
 * @param explanation - Объяснение задания на языке пользователя
 * @param onComplete - Обработчик завершения задания
 * @param onClose - Обработчик закрытия модального окна
 */
export function MissingWordTaskWidget({
  task,
  explanation,
  onComplete,
  onClose,
}: MissingWordTaskProps): React.JSX.Element {
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

    if (correct) {
      onComplete(true, task.points);
    }
  };

  const handleClose = () => {
    if (isSubmitted && isCorrect) {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("taskTitles.missingWord")}</DialogTitle>
          <DialogDescription>{explanation}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center">
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
              {task.sentence.split("___").map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="mx-2 inline-block min-w-[100px] rounded-md border-2 border-dashed border-gray-400 bg-white dark:bg-gray-800 px-3 py-1 font-semibold text-gray-600 dark:text-gray-400">
                      {selectedAnswerId
                        ? task.options.find((opt) => opt.id === selectedAnswerId)
                            ?.text || "___"
                        : "___"}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>

          {!isSubmitted ? (
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
            <Button onClick={onClose} variant="destructive" className="w-full sm:w-auto">
              {t("buttons.close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

