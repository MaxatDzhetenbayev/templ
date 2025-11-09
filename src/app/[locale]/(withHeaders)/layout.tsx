import React from "react";

import { Header } from "@/shared/components/header";

/**
 * Layout для страниц с шапкой
 *
 * @param children - Дочерние компоненты
 * @returns JSX элемент с layout и шапкой
 */
export default function WithHeadersLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white">
      {/* Фоновые градиенты (в стиле главной страницы) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(56,189,248,1) 0%, rgba(34,211,238,0) 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 left-1/4 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(34,211,238,1) 0%, rgba(147,197,253,0) 70%)",
          }}
        />
      </div>

      <Header />
      <main>{children}</main>
    </div>
  );
}
