import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type {
  Module,
  TaskStatus,
  UserProgress,
} from "../schemas/learning.schema";
import { saveMockUserProgress } from "../utils/mock-data";

interface LearningState {
  // Состояние
  modules: Module[];
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;

  // Действия
  setModules: (modules: Module[]) => void;
  setUserProgress: (progress: UserProgress) => void;
  validateProgress: () => void;
  updateLevelTaskProgress: (
    moduleId: string,
    levelId: string,
    taskId: string,
    status: TaskStatus,
    score?: number,
    lastAttemptedTaskId?: string
  ) => void;
  completeLevel: (
    moduleId: string,
    levelId: string,
    completedTaskIds?: string[]
  ) => void;
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

      setModules: (modules) => {
        set({ modules });
        // После загрузки модулей валидируем прогресс, если он уже загружен
        const currentState = useLearningStore.getState();
        if (currentState.userProgress && modules.length > 0) {
          // Валидируем прогресс с новыми модулями
          currentState.validateProgress();
        }
      },

      setUserProgress: (progress) =>
        set((state) => {
          // Проверяем и обновляем статусы завершения уровней и модулей
          const validatedProgress = { ...progress };

          // Проходим по всем модулям прогресса
          validatedProgress.modulesProgress.forEach((moduleProgress) => {
            const learningModule = state.modules.find(
              (m) => m.id === moduleProgress.moduleId
            );

            if (learningModule) {
              // Проверяем каждый уровень модуля
              learningModule.levels.forEach((level) => {
                const levelProgress = moduleProgress.levelsProgress.find(
                  (lp) => lp.levelId === level.id
                );

                if (levelProgress) {
                  // Проверяем, все ли задачи уровня завершены
                  const allTasksCompleted =
                    levelProgress.tasksProgress.length >= level.tasksPerLevel &&
                    levelProgress.tasksProgress.every(
                      (tp) => tp.status === "completed"
                    );

                  // Если все задачи завершены, но уровень не помечен как завершенный
                  if (allTasksCompleted && !levelProgress.isCompleted) {
                    levelProgress.isCompleted = true;
                    if (!levelProgress.completedAt) {
                      levelProgress.completedAt = new Date().toISOString();
                    }
                  }
                }
              });

              // Проверяем, все ли уровни модуля завершены
              const allLevelsCompleted = learningModule.levels.every((lvl) => {
                const lp = moduleProgress.levelsProgress.find(
                  (l) => l.levelId === lvl.id
                );
                return lp?.isCompleted ?? false;
              });

              if (allLevelsCompleted && !moduleProgress.isCompleted) {
                moduleProgress.isCompleted = true;
                if (!moduleProgress.completedAt) {
                  moduleProgress.completedAt = new Date().toISOString();
                }
              }
            }
          });

          saveMockUserProgress(validatedProgress);
          return { userProgress: validatedProgress };
        }),

      validateProgress: () =>
        set((state) => {
          if (!state.userProgress || state.modules.length === 0) return state;

          const validatedProgress = { ...state.userProgress };

          // Проходим по всем модулям прогресса
          validatedProgress.modulesProgress.forEach((moduleProgress) => {
            const learningModule = state.modules.find(
              (m) => m.id === moduleProgress.moduleId
            );

            if (learningModule) {
              // Проверяем каждый уровень модуля
              learningModule.levels.forEach((level) => {
                const levelProgress = moduleProgress.levelsProgress.find(
                  (lp) => lp.levelId === level.id
                );

                if (levelProgress) {
                  // Проверяем, все ли задачи уровня завершены
                  const completedTasks = levelProgress.tasksProgress.filter(
                    (tp) => tp.status === "completed"
                  );
                  const allTasksCompleted =
                    completedTasks.length >= level.tasksPerLevel &&
                    levelProgress.tasksProgress.every(
                      (tp) => tp.status === "completed"
                    );

                  // Если все задачи завершены, но уровень не помечен как завершенный
                  if (allTasksCompleted && !levelProgress.isCompleted) {
                    levelProgress.isCompleted = true;
                    if (!levelProgress.completedAt) {
                      levelProgress.completedAt = new Date().toISOString();
                    }
                  }
                }
              });

              // Проверяем, все ли уровни модуля завершены
              const allLevelsCompleted = learningModule.levels.every((lvl) => {
                const lp = moduleProgress.levelsProgress.find(
                  (l) => l.levelId === lvl.id
                );
                return lp?.isCompleted ?? false;
              });

              if (allLevelsCompleted && !moduleProgress.isCompleted) {
                moduleProgress.isCompleted = true;
                if (!moduleProgress.completedAt) {
                  moduleProgress.completedAt = new Date().toISOString();
                }
              }
            }
          });

          saveMockUserProgress(validatedProgress);
          return { userProgress: validatedProgress };
        }),

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
              completedAt:
                score !== undefined ? new Date().toISOString() : undefined,
              attempts: 1,
              lastAttemptedTaskId,
            });
          }

          // Обновляем счет уровня
          levelProgress.totalScore = levelProgress.tasksProgress.reduce(
            (sum, tp) => sum + (tp.score || 0),
            0
          );

          // Проверяем, все ли задачи уровня завершены
          const learningModule = state.modules.find((m) => m.id === moduleId);
          const level = learningModule?.levels.find((l) => l.id === levelId);

          if (level) {
            // Проверяем, что все задачи в tasksProgress завершены
            const allTasksCompleted =
              levelProgress.tasksProgress.length >= level.tasksPerLevel &&
              levelProgress.tasksProgress.every(
                (tp) => tp.status === "completed"
              );

            // Если все задачи завершены, но уровень еще не помечен как завершенный
            if (allTasksCompleted && !levelProgress.isCompleted) {
              levelProgress.isCompleted = true;
              levelProgress.completedAt = new Date().toISOString();
            }
          }

          // Обновляем счет модуля
          moduleProgress.totalScore = moduleProgress.levelsProgress.reduce(
            (sum, lp) => sum + lp.totalScore,
            0
          );

          // Проверяем, все ли уровни модуля завершены
          if (learningModule) {
            const allLevelsCompleted = learningModule.levels.every((lvl) => {
              const lp = moduleProgress.levelsProgress.find(
                (l) => l.levelId === lvl.id
              );
              return lp?.isCompleted ?? false;
            });

            if (allLevelsCompleted && !moduleProgress.isCompleted) {
              moduleProgress.isCompleted = true;
              moduleProgress.completedAt = new Date().toISOString();
            }
          }

          // Обновляем общий счет пользователя
          updatedProgress.totalPoints = updatedProgress.modulesProgress.reduce(
            (sum, mp) => sum + mp.totalScore,
            0
          );

          saveMockUserProgress(updatedProgress);
          return { userProgress: updatedProgress };
        }),

      completeLevel: (moduleId, levelId, completedTaskIds) =>
        set((state) => {
          if (!state.userProgress) return state;

          const updatedProgress = { ...state.userProgress };
          let moduleProgress = updatedProgress.modulesProgress.find(
            (mp) => mp.moduleId === moduleId
          );

          // Создаем moduleProgress, если его нет
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

          // Создаем запись прогресса, если её нет
          if (!levelProgress) {
            levelProgress = {
              levelId,
              tasksProgress: [],
              totalScore: 0,
              isCompleted: false,
            };
            moduleProgress.levelsProgress.push(levelProgress);
          }

          // Получаем модуль и уровень для получения списка задач
          const learningModule = state.modules.find((m) => m.id === moduleId);
          const level = learningModule?.levels.find((l) => l.id === levelId);

          // Если передан список выполненных задач, убеждаемся, что все они добавлены в tasksProgress
          // Это важно, так как некоторые задачи могут еще не быть сохранены из-за асинхронности
          if (level && completedTaskIds && completedTaskIds.length > 0) {
            // Создаем Set из ID задач, которые уже есть в tasksProgress
            const existingTaskIds = new Set(
              levelProgress.tasksProgress.map((tp) => tp.taskId)
            );

            // Добавляем все задачи из списка выполненных задач, которых еще нет в tasksProgress
            completedTaskIds.forEach((taskId: string) => {
              if (!existingTaskIds.has(taskId)) {
                // Находим задачу в taskPool для получения points
                const task = level.taskPool.find((t) => t.id === taskId);

                if (task) {
                  // Добавляем задачу в tasksProgress со статусом "completed"
                  levelProgress.tasksProgress.push({
                    taskId: task.id,
                    status: "completed",
                    score: task.points || 0,
                    completedAt: new Date().toISOString(),
                    attempts: 1,
                  });
                }
              }
            });
          }

          // Помечаем все задания уровня как завершенные, если они еще не завершены
          levelProgress.tasksProgress.forEach((taskProgress) => {
            if (taskProgress.status !== "completed") {
              taskProgress.status = "completed";
            }
            // Убеждаемся, что у всех задач есть score
            if (!taskProgress.score && level) {
              // Пытаемся найти задачу в модуле для получения points
              const task = level.taskPool.find(
                (t) => t.id === taskProgress.taskId
              );
              if (task) {
                taskProgress.score = task.points || 0;
              }
            }
            // Убеждаемся, что у всех задач есть completedAt
            if (!taskProgress.completedAt) {
              taskProgress.completedAt = new Date().toISOString();
            }
          });

          // Пересчитываем счет уровня на основе завершенных заданий
          levelProgress.totalScore = levelProgress.tasksProgress.reduce(
            (sum, tp) => sum + (tp.score || 0),
            0
          );

          // Помечаем уровень как завершенный
          levelProgress.isCompleted = true;
          levelProgress.completedAt = new Date().toISOString();

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

          // Проверяем, все ли уровни модуля завершены
          if (learningModule) {
            const allLevelsCompleted = learningModule.levels.every((lvl) => {
              const lp = moduleProgress.levelsProgress.find(
                (l) => l.levelId === lvl.id
              );
              return lp?.isCompleted ?? false;
            });

            if (allLevelsCompleted && !moduleProgress.isCompleted) {
              moduleProgress.isCompleted = true;
              moduleProgress.completedAt = new Date().toISOString();
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
              updatedProgress.totalPoints =
                updatedProgress.modulesProgress.reduce(
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
