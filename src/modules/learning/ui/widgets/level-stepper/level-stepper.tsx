"use client";

import { CheckCircle2, Pause, Play, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

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

import type { Level, Task } from "../../../schemas/learning.schema";
import { checkAnswer } from "../../../utils/learning.utils";
import { AiChatTask } from "../../components/ai-chat-task";

export interface LevelStepperProps {
  level: Level;
  tasks: Task[];
  onComplete: () => void;
  onClose: () => void;
  onTaskAnswer: (taskId: string, isCorrect: boolean, points: number) => void;
  onTasksShuffle?: (shuffledTasks: Task[]) => void;
}

/**
 * Компонент stepper для прохождения уровня с 4 заданиями
 *
 * @param level - Уровень
 * @param tasks - Массив из 4 заданий
 * @param onComplete - Обработчик завершения всех заданий
 * @param onClose - Обработчик закрытия модального окна
 * @param onTaskAnswer - Обработчик ответа на задание
 */
export function LevelStepper({
  level,
  tasks,
  onComplete,
  onClose,
  onTaskAnswer,
  onTasksShuffle,
}: LevelStepperProps): React.JSX.Element {
  const t = useTranslations("learning");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskResults, setTaskResults] = useState<boolean[]>([]);

  const currentTask = tasks[currentTaskIndex];
  const totalTasks = tasks.length;
  const completedTasks = taskResults.filter((r) => r).length;

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Сбрасываем состояние при смене задания
  useEffect(() => {
    if (!isLevelCompleted) {
      setSelectedAnswerId(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setIsPlaying(false);
    }
  }, [currentTaskIndex, tasks, isLevelCompleted]);

  const handleSubmit = () => {
    if (!currentTask) return;

    // Для ai-chat заданий логика обрабатывается внутри компонента AiChatTask
    if (currentTask.type === "ai-chat") {
      return;
    }

    // Для остальных типов заданий требуется выбранный ответ
    if (!selectedAnswerId) return;

    const correct = checkAnswer(currentTask, selectedAnswerId);
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Вызываем обработчик ответа
    onTaskAnswer(currentTask.id, correct, correct ? currentTask.points : 0);

    if (correct) {
      // Обновляем результаты
      const newResults = [...taskResults, true];
      setTaskResults(newResults);

      // Если все задания выполнены правильно
      if (newResults.length === totalTasks) {
        // Показываем финальное сообщение о завершении уровня
        setTimeout(() => {
          setIsLevelCompleted(true);
        }, 1500);
      } else {
        // Переходим к следующему заданию
        setTimeout(() => {
          setCurrentTaskIndex(newResults.length);
        }, 1500);
      }
    } else {
      // При ошибке сбрасываем все и возвращаемся к первому заданию
      setTimeout(() => {
        setTaskResults([]);
        setCurrentTaskIndex(0);
        setIsLevelCompleted(false);
        // Перемешиваем задания для новой попытки
        if (onTasksShuffle) {
          const shuffled = [...tasks].sort(() => Math.random() - 0.5);
          onTasksShuffle(shuffled);
        }
      }, 1500);
    }
  };

  const handlePlay = () => {
    if (audioRef.current && currentTask?.type === "listening") {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderTaskContent = () => {
    if (!currentTask) return null;

    switch (currentTask.type) {
      case "missing-word":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900 p-6 text-center">
              <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                {currentTask.sentence.split("___").map((part, index, array) => (
                  <React.Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <span className="mx-2 inline-block min-w-[100px] rounded-md border-2 border-dashed border-gray-400 bg-white dark:bg-gray-800 px-3 py-1 font-semibold text-gray-600 dark:text-gray-400">
                        {selectedAnswerId
                          ? currentTask.options.find(
                              (opt) => opt.id === selectedAnswerId
                            )?.text || "___"
                          : "___"}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>

            {!isSubmitted ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentTask.options.map((option) => (
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
                {currentTask.options.map((option) => {
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
        );

      case "listening":
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-50 dark:bg-gray-900 p-6">
              <audio
                ref={audioRef}
                src={currentTask.audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <Button
                onClick={handlePlay}
                size="lg"
                className="size-16 rounded-full"
                variant="outline"
              >
                {isPlaying ? (
                  <Pause className="size-8" />
                ) : (
                  <Play className="size-8" />
                )}
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("messages.audioHint")}
              </p>
            </div>

            <div>
              <p className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {currentTask.question}
              </p>

              {!isSubmitted ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentTask.options.map((option) => (
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
                  {currentTask.options.map((option) => {
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
          </div>
        );

      case "riddle":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t("taskTitles.riddle")}
                </h3>
              </div>
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {currentTask.riddle}
              </p>
            </div>

            {!isSubmitted ? (
              <div>
                <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("messages.selectAnswer")}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentTask.options.map((option) => (
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
                {currentTask.options.map((option) => {
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
        );

      case "ai-chat":
        return (
          <AiChatTask
            task={currentTask}
            onComplete={() => {
              const correct = true; // ai-chat всегда засчитывается как правильный
              setIsCorrect(correct);
              setIsSubmitted(true);

              // Вызываем обработчик ответа
              onTaskAnswer(currentTask.id, correct, currentTask.points);

              // Обновляем результаты
              const newResults = [...taskResults, true];
              setTaskResults(newResults);

              // Если все задания выполнены правильно
              if (newResults.length === totalTasks) {
                // Показываем финальное сообщение о завершении уровня
                setTimeout(() => {
                  setIsLevelCompleted(true);
                }, 1500);
              } else {
                // Переходим к следующему заданию
                setTimeout(() => {
                  setCurrentTaskIndex(newResults.length);
                }, 1500);
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {level.title || `Уровень`}
            {!isLevelCompleted &&
              currentTask &&
              ` - ${t(`taskTitles.${currentTask.type}`)}`}
          </DialogTitle>
          <DialogDescription>
            {isLevelCompleted
              ? t("messages.allTasksCompleted")
              : `Задание ${currentTaskIndex + 1} из ${totalTasks}`}
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Progress */}
        <div className="flex items-center justify-between py-4">
          {tasks.map((_, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    isLevelCompleted || index < currentTaskIndex
                      ? "border-green-500 bg-green-500 text-white"
                      : index === currentTaskIndex
                      ? "border-primary bg-primary text-white"
                      : "border-gray-300 bg-gray-100 text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  )}
                >
                  {isLevelCompleted || index < currentTaskIndex ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < tasks.length - 1 && (
                  <div
                    className={cn(
                      "mt-2 h-1 w-16 transition-all",
                      isLevelCompleted || index < currentTaskIndex
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-700"
                    )}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Level Completed Screen */}
        {isLevelCompleted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-500">
              <CheckCircle2 className="size-12 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t("messages.levelCompleted")}
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              {t("messages.levelCompletedDescription")}
            </p>
            <Button onClick={onClose} className="w-full sm:w-auto" size="lg">
              {t("buttons.close")}
            </Button>
          </div>
        ) : (
          <>
            {/* Current Task */}
            <div className="flex-1 min-h-0 py-4 overflow-y-auto">
              {renderTaskContent()}
            </div>

            {/* Task Footer */}
            <DialogFooter>
              {!isSubmitted && currentTask?.type !== "ai-chat" ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedAnswerId}
                  className="w-full sm:w-auto"
                >
                  {t("buttons.check")}
                </Button>
              ) : !isSubmitted && currentTask?.type === "ai-chat" ? (
                // Для ai-chat заданий кнопка не показывается, логика обрабатывается внутри компонента
                null
              ) : isCorrect ? (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="size-6" />
                    <span className="text-lg font-semibold">
                      {t("messages.success", {
                        points: currentTask?.points || 0,
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <XCircle className="size-6" />
                    <span className="text-lg font-semibold">
                      {t("messages.error")}
                    </span>
                  </div>
                </div>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
