"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  UserPlus,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui";
import { getUsers } from "@/shared/lib/mock-auth";
import { getAllUsersProgressData } from "@/modules/learning/utils/mock-data";
import { getLocalizedModules } from "@/modules/learning/utils/mock-data";
import { getOverallProgress } from "@/modules/learning/utils/learning.utils";

/**
 * Компонент статистики дэшборда
 */
export function DashboardStats() {
  const t = useTranslations("dashboards.stats");
  const [stats, setStats] = useState([
    {
      title: t("totalUsers"),
      value: "0",
      change: "+0",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t("activeUsers"),
      value: "0",
      change: "+0%",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t("newRegistrations"),
      value: "0",
      change: "+0%",
      icon: UserPlus,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: t("studyTime"),
      value: "0ч",
      change: "+0%",
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const users = getUsers();
    const allProgress = getAllUsersProgressData();
    const modules = getLocalizedModules("ru");

    // Подсчитываем активных пользователей (тех, у кого есть прогресс)
    const activeUsers = users.filter((user) => {
      const progress = allProgress[user.id];
      if (!progress) return false;
      const overallProgress = getOverallProgress(modules, progress);
      return overallProgress.completedTasks > 0;
    });

    // Подсчитываем общее количество завершенных уроков
    let totalCompletedLessons = 0;
    let totalPoints = 0;
    users.forEach((user) => {
      const progress = allProgress[user.id];
      if (progress) {
        const overallProgress = getOverallProgress(modules, progress);
        totalCompletedLessons += overallProgress.completedTasks;
        totalPoints += progress.totalPoints;
      }
    });

    // Подсчитываем новых пользователей за последние 7 дней
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newUsers = users.filter((user) => {
      const createdAt = new Date(user.createdAt).getTime();
      return createdAt >= sevenDaysAgo;
    });

    // Оценка времени обучения (примерно 15 минут на урок)
    const estimatedHours = Math.round((totalCompletedLessons * 15) / 60);

    setStats([
      {
        title: t("totalUsers"),
        value: users.length.toLocaleString(),
        change: `+${users.length > 0 ? Math.floor(users.length * 0.1) : 0}`,
        icon: Users,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        title: t("activeUsers"),
        value: activeUsers.length.toLocaleString(),
        change: `+${activeUsers.length > 0 ? Math.floor((activeUsers.length / users.length) * 100) : 0}%`,
        icon: Activity,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        title: t("newRegistrations"),
        value: newUsers.length.toLocaleString(),
        change: `+${newUsers.length > 0 ? Math.floor((newUsers.length / users.length) * 100) : 0}%`,
        icon: UserPlus,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
      {
        title: t("studyTime"),
        value: `${estimatedHours}ч`,
        change: `+${estimatedHours > 0 ? Math.floor(estimatedHours * 0.1) : 0}%`,
        icon: Clock,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
    ]);
  }, [t]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs text-green-500">{stat.change}</p>
                </div>
                <div
                  className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

