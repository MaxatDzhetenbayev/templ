"use client";

import { useTranslations } from "next-intl";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui";

/**
 * Компонент статистики дэшборда
 */
export function DashboardStats() {
  const t = useTranslations("dashboards.stats");

  const stats = [
    {
      title: t("lessonsCompleted"),
      value: "127",
      change: "+12%",
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: t("studyTime"),
      value: "24ч 30м",
      change: "+8%",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: t("currentStreak"),
      value: "15",
      change: "+3",
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: t("totalPoints"),
      value: "2,450",
      change: "+180",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

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

