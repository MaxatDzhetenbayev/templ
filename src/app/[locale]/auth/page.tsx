"use client";

import { AuthForm } from "@/shared/components/auth-form";
import { ThemeToggle } from "@/shared/components/header";

export default function AuthPage() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white text-neutral-900 dark:bg-gradient-to-b dark:from-neutral-900 dark:via-neutral-950 dark:to-black dark:text-white">
      {/* Переключатель темы в правом верхнем углу */}
      <div className="absolute top-6 right-6 z-10 md:top-10 md:right-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
}
