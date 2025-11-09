"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";
import { getUsers } from "@/shared/lib/mock-auth";
import { getAllUsersProgressData } from "@/modules/learning/utils/mock-data";
import { getLocalizedModules } from "@/modules/learning/utils/mock-data";
import { getOverallProgress } from "@/modules/learning/utils/learning.utils";

import { PieChart as PieChartIcon } from "lucide-react";

/**
 * Круговая диаграмма прогресса
 */
export function ProgressChart() {
  const t = useTranslations("dashboards.charts");
  const [data, setData] = useState([
    { name: t("progress.completed"), value: 0, color: "hsl(142, 71%, 45%)" },
    {
      name: t("progress.inProgress"),
      value: 0,
      color: "hsl(45, 93%, 47%)",
    },
    {
      name: t("progress.notStarted"),
      value: 100,
      color: "hsl(0, 0%, 75%)",
    },
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const users = getUsers();
    const allProgress = getAllUsersProgressData();
    const modules = getLocalizedModules("ru");

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    users.forEach((user) => {
      const progress = allProgress[user.id];
      if (!progress) {
        notStarted++;
        return;
      }

      const overallProgress = getOverallProgress(modules, progress);
      if (overallProgress.percent === 100) {
        completed++;
      } else if (overallProgress.percent > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    });

    const total = users.length || 1;
    setData([
      { name: t("progress.completed"), value: Math.round((completed / total) * 100), color: "hsl(142, 71%, 45%)" },
      {
        name: t("progress.inProgress"),
        value: Math.round((inProgress / total) * 100),
        color: "hsl(45, 93%, 47%)",
      },
      {
        name: t("progress.notStarted"),
        value: Math.round((notStarted / total) * 100),
        color: "hsl(0, 0%, 75%)",
      },
    ]);
  }, [t]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("progress.title")}</CardTitle>
          <PieChartIcon className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

