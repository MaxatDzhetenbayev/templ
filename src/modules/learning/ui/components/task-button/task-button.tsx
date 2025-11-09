"use client";

import { Check, FileText, Lock, Mic } from "lucide-react";
import React from "react";

import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";

import type { TaskStatus, TaskType } from "../../../schemas/learning.schema";
import { TASK_TYPES } from "../../../constants/learning.constants";

export interface TaskButtonProps {
  taskType: TaskType;
  status: TaskStatus;
  label: string;
  onClick: () => void;
  className?: string;
}

/**
 * Кнопка задания в модуле
 *
 * @param taskType - Тип задания
 * @param status - Статус задания (locked, available, completed)
 * @param label - Название задания
 * @param onClick - Обработчик клика
 * @param className - Дополнительные классы
 */
export function TaskButton({
  taskType,
  status,
  label,
  onClick,
  className,
}: TaskButtonProps): React.JSX.Element {
  const taskConfig = TASK_TYPES[taskType];

  const getIcon = () => {
    if (status === "locked") {
      return <Lock className="size-5 text-yellow-500" />;
    }
    if (status === "completed") {
      return <Check className="size-5 text-white" />;
    }
    if (taskType === "listening") {
      return <Mic className="size-5 text-gray-600 dark:text-gray-400" />;
    }
    return <FileText className="size-5 text-gray-600 dark:text-gray-400" />;
  };

  const getButtonStyles = () => {
    if (status === "completed") {
      return "bg-green-500 hover:bg-green-600 text-white border-green-600";
    }
    if (status === "locked") {
      return "bg-white dark:bg-card text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-75";
    }
    return "bg-white dark:bg-card text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-card/80";
  };

  return (
    <Button
      onClick={onClick}
      disabled={status === "locked"}
      className={cn(
        "w-full justify-start gap-3 px-4 py-3 rounded-lg border transition-colors",
        getButtonStyles(),
        className
      )}
      variant="outline"
    >
      <div className="flex items-center justify-center min-w-[24px]">
        {getIcon()}
      </div>
      <span className="flex-1 text-left font-medium">{label}</span>
    </Button>
  );
}

