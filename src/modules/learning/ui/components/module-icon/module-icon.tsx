"use client";

import { useRouter } from "@/shared/configs/i18/navigation";
import { Check, Lock } from "lucide-react";
import { motion } from "framer-motion";
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
 * Карточка модуля в современном стиле
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
      return "from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800";
    }
    if (isCompleted) {
      return "from-green-400 to-green-500";
    }
    switch (module.color) {
      case "purple":
        return "from-purple-400 to-purple-500";
      case "yellow":
        return "from-yellow-400 to-yellow-500";
      case "orange":
        return "from-orange-400 to-orange-500";
      default:
        return "from-sky-400 to-sky-500";
    }
  };

  const handleClick = () => {
    if (!isAvailable) return;
    router.push(`/modules/${module.id}/levels`);
  };

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-3", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <button
          onClick={handleClick}
          disabled={!isAvailable}
          className={cn(
            "group relative flex size-24 items-center justify-center rounded-2xl text-4xl font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50",
            `bg-gradient-to-br ${getColorClasses()}`
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
              width="96"
              height="96"
            >
              <circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="4"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="42"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${(progressPercent / 100) * 264} 264`}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercent / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
          )}

          {/* Иконка статуса */}
          {!isAvailable && (
            <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-gray-400 shadow-md dark:bg-gray-600">
              <Lock className="size-4 text-white" />
            </div>
          )}
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-md">
              <Check className="size-4 text-white" />
            </div>
          )}
        </button>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="max-w-[120px] text-center text-sm font-semibold text-neutral-900 dark:text-white">
          {module.title}
        </span>
        {isAvailable && progressPercent > 0 && (
          <span className="text-xs text-neutral-600 dark:text-white/60">
            {Math.round(progressPercent)}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

