"use client";

import { useTranslations } from "next-intl";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";

import { Activity } from "lucide-react";

/**
 * График активности по времени
 */
export function ActivityChart() {
  const t = useTranslations("dashboards.charts");

  const data = [
    { month: t("months.january"), points: 400, lessons: 20 },
    { month: t("months.february"), points: 600, lessons: 35 },
    { month: t("months.march"), points: 500, lessons: 28 },
    { month: t("months.april"), points: 800, lessons: 45 },
    { month: t("months.may"), points: 700, lessons: 38 },
    { month: t("months.june"), points: 900, lessons: 52 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("activity.title")}</CardTitle>
          <Activity className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
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
            <Area
              type="monotone"
              dataKey="points"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorPoints)"
              name={t("activity.points")}
            />
            <Area
              type="monotone"
              dataKey="lessons"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorLessons)"
              name={t("activity.lessons")}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

