"use client";

import { useTranslations } from "next-intl";

/**
 * Футер для лендинга
 */
export function FooterSection() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="relative overflow-hidden border-t bg-muted/30 py-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.01]" />
      <div className="container relative mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("about.title")}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("about.description")}
            </p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("links.title")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("links.courses")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("links.pricing")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("links.about")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("support.title")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("support.help")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("support.contact")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              {t("social.title")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("social.facebook")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("social.instagram")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="group relative inline-block text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("social.telegram")}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

