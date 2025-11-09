"use client";

import { useTranslations } from "next-intl";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";

import { PieChart as PieChartIcon } from "lucide-react";

/**
 * Круговая диаграмма прогресса
 */
export function ProgressChart() {
  const t = useTranslations("dashboards.charts");

  const data = [
    { name: t("progress.completed"), value: 65, color: "hsl(142, 71%, 45%)" },
    {
      name: t("progress.inProgress"),
      value: 25,
      color: "hsl(45, 93%, 47%)",
    },
    {
      name: t("progress.notStarted"),
      value: 10,
      color: "hsl(0, 0%, 75%)",
    },
  ];

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

