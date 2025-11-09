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
    { month: t("months.january"), points: 40240, lessons: 2012 },
    { month: t("months.february"), points: 60180, lessons: 3509 },
    { month: t("months.march"), points: 50120, lessons: 2806 },
    { month: t("months.april"), points: 80240, lessons: 4523 },
    { month: t("months.may"), points: 70160, lessons: 3808 },
    { month: t("months.june"), points: 90180, lessons: 5214 },
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
                  stopColor="hsl(217, 91%, 60%)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(217, 91%, 60%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(142, 76%, 50%)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(142, 76%, 50%)"
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
              stroke="hsl(217, 91%, 60%)"
              fillOpacity={1}
              fill="url(#colorPoints)"
              name={t("activity.points")}
            />
            <Area
              type="monotone"
              dataKey="lessons"
              stroke="hsl(142, 76%, 50%)"
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

