"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { ModuleCard } from "../../components/module-card";
import {
  MissingWordTaskWidget,
  ListeningTaskWidget,
  RiddleTaskWidget,
  AiChatTaskWidget,
} from "../../widgets";
import { useLearningStore } from "../../../model/learning.store";
import { mockModules, getMockUserProgress } from "../../../utils/mock-data";
import type { Module, Task } from "../../../schemas/learning.schema";
import { getTaskFromModule } from "../../../utils/learning.utils";
import { getCurrentUser } from "@/shared/lib/mock-auth";

/**
 * Виджет списка модулей обучения
 */
export function ModulesList(): React.JSX.Element {
  const t = useTranslations("learning");
  const {
    modules,
    userProgress,
    setModules,
    setUserProgress,
    updateTaskProgress,
    addPoints,
  } = useLearningStore();

  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    null
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Загружаем моковые данные при монтировании
  useEffect(() => {
    if (modules.length === 0) {
      setModules(mockModules);
    }
    if (!userProgress) {
      const progress = getMockUserProgress();
      setUserProgress(progress);
    }
  }, [modules.length, userProgress, setModules, setUserProgress]);

  const handleTaskClick = (moduleId: string, taskId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    const task = getTaskFromModule(module, taskId);
    if (!task) return;

    setSelectedModuleId(moduleId);
    setSelectedTaskId(taskId);
    setSelectedTask(task);
  };

  const handleTaskComplete = (isCorrect: boolean, points: number) => {
    if (!selectedModuleId || !selectedTaskId) return;

    if (isCorrect) {
      updateTaskProgress(
        selectedModuleId,
        selectedTaskId!,
        "completed",
        points
      );
      addPoints(points);
    }
  };

  const handleTaskClose = () => {
    setSelectedModuleId(null);
    setSelectedTaskId(null);
    setSelectedTask(null);
  };

  const getTaskLabel = (key: string): string => {
    return t(key);
  };

  const getTaskExplanation = (taskType: string): string => {
    const taskTypeMap: Record<string, string> = {
      "missing-word": "taskExplanations.missingWord",
      listening: "taskExplanations.listening",
      riddle: "taskExplanations.riddle",
      "ai-chat": "taskExplanations.aiChat",
    };
    const key = taskTypeMap[taskType] || "taskExplanations.missingWord";
    return t(key);
  };

  const renderTaskWidget = () => {
    if (!selectedTask) return null;

    const explanation = getTaskExplanation(selectedTask.type);

    switch (selectedTask.type) {
      case "missing-word":
        return (
          <MissingWordTaskWidget
            task={selectedTask}
            explanation={explanation}
            onComplete={handleTaskComplete}
            onClose={handleTaskClose}
          />
        );
      case "listening":
        return (
          <ListeningTaskWidget
            task={selectedTask}
            explanation={explanation}
            onComplete={handleTaskComplete}
            onClose={handleTaskClose}
          />
        );
      case "riddle":
        return (
          <RiddleTaskWidget
            task={selectedTask}
            explanation={explanation}
            onComplete={handleTaskComplete}
            onClose={handleTaskClose}
          />
        );
      case "ai-chat":
        return (
          <AiChatTaskWidget
            task={selectedTask}
            explanation={explanation}
            onClose={handleTaskClose}
          />
        );
      default:
        return null;
    }
  };

  const user = getCurrentUser();
  const totalPoints = userProgress?.totalPoints || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-700 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">
            {t("title")}
          </h1>
          <p className="text-white/90">{t("subtitle")}</p>
          {user && (
            <div className="mt-4 inline-block rounded-lg bg-white/20 backdrop-blur px-4 py-2">
              <span className="font-semibold text-white">
                {t("totalPoints")}: {totalPoints} {t("points")}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              userProgress={userProgress}
              onTaskClick={handleTaskClick}
              getTaskLabel={getTaskLabel}
            />
          ))}
        </div>

        {renderTaskWidget()}
      </div>
    </div>
  );
}

