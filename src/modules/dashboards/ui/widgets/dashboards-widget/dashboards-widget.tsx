"use client";

import { useTranslations } from "next-intl";

import {
  ActivityChart,
  ProgressChart,
  StatsCard,
  WeeklyActivityChart,
} from "../../components";
import { DashboardStats } from "../../components/dashboard-stats";

/**
 * Виджет дэшборда с аналитикой и инфографикой
 */
export function DashboardsWidget() {
  const t = useTranslations("dashboards");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <DashboardStats />

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyActivityChart />
        </div>
        <div>
          <ProgressChart />
        </div>
      </div>

      <div className="mt-6">
        <ActivityChart />
      </div>
    </div>
  );
}

