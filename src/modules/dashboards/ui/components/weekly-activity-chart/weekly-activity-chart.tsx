"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";

import { Calendar } from "lucide-react";

/**
 * График недельной активности
 */
export function WeeklyActivityChart() {
  const t = useTranslations("dashboards.charts");

  const data = [
    { day: t("days.monday"), lessons: 12, time: 120 },
    { day: t("days.tuesday"), lessons: 19, time: 180 },
    { day: t("days.wednesday"), lessons: 15, time: 150 },
    { day: t("days.thursday"), lessons: 22, time: 210 },
    { day: t("days.friday"), lessons: 18, time: 170 },
    { day: t("days.saturday"), lessons: 10, time: 90 },
    { day: t("days.sunday"), lessons: 8, time: 75 },
  ];

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
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
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

