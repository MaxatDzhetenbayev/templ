"use client";

import { useRouter } from "@/shared/configs/i18/navigation";
import { Check, Lock } from "lucide-react";
import React from "react";

import { cn } from "@/shared/lib/utils";

import type { Module, ModuleProgress } from "../../../schemas/learning.schema";
import { getModuleProgressPercent } from "../../../utils/learning.utils";

export interface ModuleIconProps {
  module: Module;
  moduleIndex: number;
  userProgress: { modulesProgress: ModuleProgress[] } | null;
  isAvailable: boolean;
  className?: string;
}

/**
 * Круглая иконка модуля в стиле Duolingo
 *
 * @param module - Модуль обучения
 * @param moduleIndex - Индекс модуля
 * @param userProgress - Прогресс пользователя
 * @param isAvailable - Доступен ли модуль
 * @param className - Дополнительные классы
 */
export function ModuleIcon({
  module,
  moduleIndex,
  userProgress,
  isAvailable,
  className,
}: ModuleIconProps): React.JSX.Element {
  const router = useRouter();
  const moduleProgress = userProgress?.modulesProgress?.find(
    (mp) => mp.moduleId === module.id
  );
  const progressPercent = getModuleProgressPercent(module, moduleProgress);
  const isCompleted = moduleProgress?.isCompleted ?? false;

  const getColorClasses = () => {
    if (!isAvailable) {
      return "bg-gray-200 dark:bg-gray-700";
    }
    if (isCompleted) {
      return "bg-gradient-to-br from-green-400 to-green-600";
    }
    switch (module.color) {
      case "purple":
        return "bg-gradient-to-br from-purple-400 to-purple-600";
      case "yellow":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600";
      case "orange":
        return "bg-gradient-to-br from-orange-400 to-orange-600";
      default:
        return "bg-gradient-to-br from-blue-400 to-blue-600";
    }
  };

  const handleClick = () => {
    if (!isAvailable) return;
    router.push(`/modules/${module.id}/levels`);
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={!isAvailable}
          className={cn(
            "relative flex size-20 items-center justify-center rounded-full text-4xl transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
            getColorClasses()
          )}
        >
          {module.icon && <span>{module.icon}</span>}
          {!module.icon && (
            <span className="text-white">{module.title[0]}</span>
          )}

          {/* Индикатор прогресса */}
          {isAvailable && progressPercent > 0 && progressPercent < 100 && (
            <svg
              className="absolute inset-0 -rotate-90 transform"
              width="80"
              height="80"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="4"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${(progressPercent / 100) * 226} 226`}
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Иконка статуса */}
          {!isAvailable && (
            <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-yellow-400">
              <Lock className="size-4 text-yellow-900" />
            </div>
          )}
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white">
              <Check className="size-4 text-green-600" />
            </div>
          )}
        </button>
      </div>
      <span className="max-w-[100px] text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        {module.title}
      </span>
    </div>
  );
}

