import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { saveMockUserProgress } from "../utils/mock-data";
import type {
  Module,
  UserProgress,
  TaskStatus,
} from "../schemas/learning.schema";

interface LearningState {
  // Состояние
  modules: Module[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;

  // Действия
  setModules: (modules: Module[]) => void;
  setUserProgress: (progress: UserProgress) => void;
  updateLevelTaskProgress: (
    moduleId: string,
    levelId: string,
    taskId: string,
    status: TaskStatus,
    score?: number,
    lastAttemptedTaskId?: string
  ) => void;
  completeLevel: (moduleId: string, levelId: string) => void;
  completeModule: (moduleId: string) => void;
  resetLevelProgress: (moduleId: string, levelId: string) => void;
  addPoints: (points: number) => void;
  subtractPoints: (points: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  modules: [],
  userProgress: null,
  isLoading: false,
  error: null,
};

export const useLearningStore = create<LearningState>()(
  devtools(
    (set) => ({
      ...initialState,

      setModules: (modules) => set({ modules }),

      setUserProgress: (progress) => {
        saveMockUserProgress(progress);
        set({ userProgress: progress });
      },

      updateLevelTaskProgress: (
        moduleId,
        levelId,
        taskId,
        status,
        score,
        lastAttemptedTaskId
      ) =>
        set((state) => {
          if (!state.userProgress) return state;

          const updatedProgress = { ...state.userProgress };
          let moduleProgress = updatedProgress.modulesProgress.find(
            (mp) => mp.moduleId === moduleId
          );

          if (!moduleProgress) {
            moduleProgress = {
              moduleId,
              levelsProgress: [],
              totalScore: 0,
              isCompleted: false,
            };
            updatedProgress.modulesProgress.push(moduleProgress);
          }

          let levelProgress = moduleProgress.levelsProgress.find(
            (lp) => lp.levelId === levelId
          );

          if (!levelProgress) {
            levelProgress = {
              levelId,
              tasksProgress: [],
              totalScore: 0,
              isCompleted: false,
            };
            moduleProgress.levelsProgress.push(levelProgress);
          }

          const taskProgress = levelProgress.tasksProgress.find(
            (tp) => tp.taskId === taskId
          );

          if (taskProgress) {
            taskProgress.status = status;
            taskProgress.attempts = (taskProgress.attempts || 0) + 1;
            if (score !== undefined) {
              taskProgress.score = score;
              taskProgress.completedAt = new Date().toISOString();
            }
            if (lastAttemptedTaskId) {
              taskProgress.lastAttemptedTaskId = lastAttemptedTaskId;
            }
          } else {
            levelProgress.tasksProgress.push({
              taskId,
              status,
              score,
              completedAt: score !== undefined ? new Date().toISOString() : undefined,
              attempts: 1,
              lastAttemptedTaskId,
            });
          }

          // Обновляем счет уровня
          levelProgress.totalScore = levelProgress.tasksProgress.reduce(
            (sum, tp) => sum + (tp.score || 0),
            0
          );

          // Обновляем счет модуля
          moduleProgress.totalScore = moduleProgress.levelsProgress.reduce(
            (sum, lp) => sum + lp.totalScore,
            0
          );

          // Обновляем общий счет пользователя
          updatedProgress.totalPoints = updatedProgress.modulesProgress.reduce(
            (sum, mp) => sum + mp.totalScore,
            0
          );

          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      completeLevel: (moduleId, levelId) =>
        set((state) => {
          if (!state.userProgress) return state;

          const updatedProgress = { ...state.userProgress };
          const moduleProgress = updatedProgress.modulesProgress.find(
            (mp) => mp.moduleId === moduleId
          );

          if (moduleProgress) {
            const levelProgress = moduleProgress.levelsProgress.find(
              (lp) => lp.levelId === levelId
            );

            if (levelProgress) {
              levelProgress.isCompleted = true;
              levelProgress.completedAt = new Date().toISOString();
            }

            // Проверяем, все ли уровни модуля завершены
            const module = state.modules.find((m) => m.id === moduleId);
            if (module) {
              const allLevelsCompleted = module.levels.every((level) => {
                const lp = moduleProgress.levelsProgress.find(
                  (l) => l.levelId === level.id
                );
                return lp?.isCompleted ?? false;
              });

              if (allLevelsCompleted && !moduleProgress.isCompleted) {
                moduleProgress.isCompleted = true;
                moduleProgress.completedAt = new Date().toISOString();
              }
            }
          }

          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      completeModule: (moduleId) =>
        set((state) => {
          if (!state.userProgress) return state;

          const updatedProgress = { ...state.userProgress };
          const moduleProgress = updatedProgress.modulesProgress.find(
            (mp) => mp.moduleId === moduleId
          );

          if (moduleProgress) {
            moduleProgress.isCompleted = true;
            moduleProgress.completedAt = new Date().toISOString();
          }

          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      resetLevelProgress: (moduleId, levelId) =>
        set((state) => {
          if (!state.userProgress) return state;

          const updatedProgress = { ...state.userProgress };
          const moduleProgress = updatedProgress.modulesProgress.find(
            (mp) => mp.moduleId === moduleId
          );

          if (moduleProgress) {
            const levelProgress = moduleProgress.levelsProgress.find(
              (lp) => lp.levelId === levelId
            );

            if (levelProgress) {
              // Сбрасываем прогресс всех заданий уровня
              levelProgress.tasksProgress = [];
              levelProgress.totalScore = 0;
              levelProgress.isCompleted = false;
              levelProgress.completedAt = undefined;

              // Пересчитываем счет модуля
              moduleProgress.totalScore = moduleProgress.levelsProgress.reduce(
                (sum, lp) => sum + lp.totalScore,
                0
              );

              // Пересчитываем общий счет пользователя
              updatedProgress.totalPoints = updatedProgress.modulesProgress.reduce(
                (sum, mp) => sum + mp.totalScore,
                0
              );
            }
          }

          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      addPoints: (points) =>
        set((state) => {
          if (!state.userProgress) return state;
          const updatedProgress = {
            ...state.userProgress,
            totalPoints: state.userProgress.totalPoints + points,
          };
          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      subtractPoints: (points) =>
        set((state) => {
          if (!state.userProgress) return state;
          // Вычитаем баллы, но не позволяем уйти в минус
          const newTotal = Math.max(0, state.userProgress.totalPoints - points);
          const updatedProgress = {
            ...state.userProgress,
            totalPoints: newTotal,
          };
          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "learning-store",
    }
  )
);
