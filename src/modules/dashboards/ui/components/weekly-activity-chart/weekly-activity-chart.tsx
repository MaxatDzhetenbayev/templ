"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";
import { getUsers } from "@/shared/lib/mock-auth";
import { getAllUsersProgressData } from "@/modules/learning/utils/mock-data";
import { getLocalizedModules } from "@/modules/learning/utils/mock-data";
import { getOverallProgress } from "@/modules/learning/utils/learning.utils";

import { Calendar } from "lucide-react";

/**
 * Кастомный компонент Tooltip с контрастным текстом
 */
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-1 text-sm font-medium text-foreground">
          {data.day}
        </p>
        <p className="text-sm text-muted-foreground">
          {payload[0].name}: <span className="font-semibold text-foreground">{payload[0].value}</span>
        </p>
        {data.time && (
          <p className="text-xs text-muted-foreground">
            Время: <span className="font-semibold text-foreground">{data.time} мин</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * График недельной активности
 */
export function WeeklyActivityChart() {
  const t = useTranslations("dashboards.charts");
  const [data, setData] = useState([
    { day: t("days.monday"), lessons: 0, time: 0 },
    { day: t("days.tuesday"), lessons: 0, time: 0 },
    { day: t("days.wednesday"), lessons: 0, time: 0 },
    { day: t("days.thursday"), lessons: 0, time: 0 },
    { day: t("days.friday"), lessons: 0, time: 0 },
    { day: t("days.saturday"), lessons: 0, time: 0 },
    { day: t("days.sunday"), lessons: 0, time: 0 },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const users = getUsers();
    const allProgress = getAllUsersProgressData();
    const modules = getLocalizedModules("ru");

    // Подсчитываем общее количество завершенных уроков
    let totalCompletedLessons = 0;
    const lessonsByDay = [0, 0, 0, 0, 0, 0, 0]; // Пн-Вс

    users.forEach((user) => {
      const progress = allProgress[user.id];
      if (!progress) return;

      const overallProgress = getOverallProgress(modules, progress);
      const userLessons = overallProgress.completedTasks;
      totalCompletedLessons += userLessons;

      // Распределяем уроки пользователя по дням недели
      // Используем дату регистрации и прогресс для распределения
      const userCreatedAt = new Date(user.createdAt);
      const daysSinceCreation = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
      
      // Распределяем уроки реалистично: больше активности в будни, меньше в выходные
      if (userLessons > 0) {
        const lessonsPerDay = Math.ceil(userLessons / Math.max(1, Math.min(daysSinceCreation, 30)));
        
        // Распределение: Пн-Пт больше активности (60%), Сб-Вс меньше (40%)
        const weekdayLessons = Math.round(lessonsPerDay * 0.6);
        const weekendLessons = Math.round(lessonsPerDay * 0.4);
        
        // Распределяем по дням недели
        for (let i = 0; i < 5; i++) {
          lessonsByDay[i] += weekdayLessons;
        }
        for (let i = 5; i < 7; i++) {
          lessonsByDay[i] += weekendLessons;
        }
      }
    });

    // Если нет данных, создаем базовое распределение на основе общего количества
    if (totalCompletedLessons === 0) {
      // Распределяем равномерно с небольшими вариациями
      const baseLessons = 100;
      lessonsByDay[0] = baseLessons * 1.2; // Понедельник - больше
      lessonsByDay[1] = baseLessons * 1.1; // Вторник
      lessonsByDay[2] = baseLessons * 1.0; // Среда
      lessonsByDay[3] = baseLessons * 1.15; // Четверг
      lessonsByDay[4] = baseLessons * 1.05; // Пятница
      lessonsByDay[5] = baseLessons * 0.7; // Суббота
      lessonsByDay[6] = baseLessons * 0.6; // Воскресенье
    } else {
      // Нормализуем данные, чтобы они соответствовали общему количеству
      const currentTotal = lessonsByDay.reduce((sum, val) => sum + val, 0);
      if (currentTotal > 0) {
        const multiplier = totalCompletedLessons / currentTotal;
        for (let i = 0; i < 7; i++) {
          lessonsByDay[i] = Math.round(lessonsByDay[i] * multiplier);
        }
      }
    }

    setData([
      { day: t("days.monday"), lessons: lessonsByDay[0], time: lessonsByDay[0] * 15 },
      { day: t("days.tuesday"), lessons: lessonsByDay[1], time: lessonsByDay[1] * 15 },
      { day: t("days.wednesday"), lessons: lessonsByDay[2], time: lessonsByDay[2] * 15 },
      { day: t("days.thursday"), lessons: lessonsByDay[3], time: lessonsByDay[3] * 15 },
      { day: t("days.friday"), lessons: lessonsByDay[4], time: lessonsByDay[4] * 15 },
      { day: t("days.saturday"), lessons: lessonsByDay[5], time: lessonsByDay[5] * 15 },
      { day: t("days.sunday"), lessons: lessonsByDay[6], time: lessonsByDay[6] * 15 },
    ]);
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("weeklyActivity.title")}</CardTitle>
          <Calendar className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis className="text-xs" tick={{ fill: "currentColor" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="lessons"
              fill="hsl(217, 91%, 60%)"
              radius={[4, 4, 0, 0]}
              name={t("weeklyActivity.lessons")}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

