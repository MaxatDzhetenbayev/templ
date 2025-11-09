import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { saveMockUserProgress } from "../utils/mock-data";
import type {
  Module,
  TaskProgress,
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
  updateTaskProgress: (
    moduleId: string,
    taskId: string,
    status: TaskStatus,
    score?: number
  ) => void;
  addPoints: (points: number) => void;
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

      updateTaskProgress: (moduleId, taskId, status, score) =>
        set((state) => {
          if (!state.userProgress) return state;

          const updatedProgress = { ...state.userProgress };
          const moduleProgress = updatedProgress.modulesProgress.find(
            (mp) => mp.moduleId === moduleId
          );

          if (moduleProgress) {
            const taskProgress = moduleProgress.tasksProgress.find(
              (tp) => tp.taskId === taskId
            );

            if (taskProgress) {
              taskProgress.status = status;
              if (score !== undefined) {
                taskProgress.score = score;
                taskProgress.completedAt = new Date().toISOString();
              }
            } else {
              moduleProgress.tasksProgress.push({
                taskId,
                status,
                score,
                completedAt: score !== undefined ? new Date().toISOString() : undefined,
              });
            }

            // Обновляем общий счет модуля
            moduleProgress.totalScore = moduleProgress.tasksProgress.reduce(
              (sum, tp) => sum + (tp.score || 0),
              0
            );
          } else {
            updatedProgress.modulesProgress.push({
              moduleId,
              tasksProgress: [
                {
                  taskId,
                  status,
                  score,
                  completedAt: score !== undefined ? new Date().toISOString() : undefined,
                },
              ],
              totalScore: score || 0,
            });
          }

          // Обновляем общий счет пользователя
          updatedProgress.totalPoints = updatedProgress.modulesProgress.reduce(
            (sum, mp) => sum + mp.totalScore,
            0
          );

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

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "learning-store",
    }
  )
);

