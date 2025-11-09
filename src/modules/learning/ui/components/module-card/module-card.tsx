"use client";

import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";

import { TaskButton } from "../task-button/task-button";
import type { Module, TaskStatus } from "../../../schemas/learning.schema";
import { TASK_TYPES } from "../../../constants/learning.constants";
import { getModuleProgress } from "../../../utils/learning.utils";
import type { UserProgress } from "../../../schemas/learning.schema";

export interface ModuleCardProps {
  module: Module;
  userProgress: UserProgress | null;
  onTaskClick: (moduleId: string, taskId: string) => void;
  getTaskLabel: (taskType: string) => string;
}

/**
 * Карточка модуля с заданиями
 *
 * @param module - Модуль обучения
 * @param userProgress - Прогресс пользователя
 * @param onTaskClick - Обработчик клика на задание
 * @param getTaskLabel - Функция для получения локализованного названия задания
 */
export function ModuleCard({
  module,
  userProgress,
  onTaskClick,
  getTaskLabel,
}: ModuleCardProps): React.JSX.Element {
  const moduleProgress = getModuleProgress(module.id, userProgress);

  const getTaskStatus = (taskId: string, index: number): TaskStatus => {
    if (!moduleProgress) {
      // Первое задание всегда доступно
      return index === 0 ? "available" : "locked";
    }

    const taskProgress = moduleProgress.tasksProgress.find(
      (tp) => tp.taskId === taskId
    );

    if (taskProgress) {
      return taskProgress.status;
    }

    // Проверяем доступность задания
    // Если предыдущее задание завершено, текущее доступно
    if (index === 0) {
      return "available";
    }

    const previousTask = module.tasks[index - 1];
    const previousTaskProgress = moduleProgress.tasksProgress.find(
      (tp) => tp.taskId === previousTask.id
    );

    if (previousTaskProgress?.status === "completed") {
      return "available";
    }

    return "locked";
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {module.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {module.tasks.map((task, index) => {
          const status = getTaskStatus(task.id, index);
          const taskLabel = getTaskLabel(TASK_TYPES[task.type].label);

          return (
            <TaskButton
              key={task.id}
              taskType={task.type}
              status={status}
              label={taskLabel}
              onClick={() => onTaskClick(module.id, task.id)}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

