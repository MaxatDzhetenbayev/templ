"use client";

import { Link, useRouter } from "@/shared/configs/i18/navigation";
import {
  getCurrentUser,
  mockLogout,
  type MockUser,
} from "@/shared/lib/mock-auth";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

// Брендовая палитра (светло-голубая)
const brand = {
  primary: "#38bdf8", // tailwind sky-400
  accent: "#93c5fd", // tailwind blue-300
};

/**
 * Header компонент с навигацией и информацией о пользователе
 *
 * @returns JSX элемент с шапкой приложения
 */
export function Header(): React.JSX.Element {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    // Получаем текущего пользователя при монтировании
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  /**
   * Обработчик выхода из системы
   */
  const handleLogout = (): void => {
    mockLogout();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10 bg-black/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="h-8 w-8 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})`,
            }}
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          />
          <span className="text-lg font-semibold tracking-tight">
            Kazakh Learn
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/10 text-sm font-medium text-white ring-1 ring-inset ring-sky-400/20">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm text-white/90">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition"
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
