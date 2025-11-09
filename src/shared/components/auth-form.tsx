"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { mockLogin, mockRegister } from "../lib/mock-auth";

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations("auth");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("ru");
  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await mockLogin(login, password);
        console.log("Login success:", user);
        // Перенаправляем на правильный locale в зависимости от языка пользователя
        const userLocale =
          user.language === "kk" ? "kk" : user.language === "en" ? "en" : "ru";
        // Используем window.location для полного перенаправления на другой locale
        window.location.href = `/${userLocale}/modules`;
      } else {
        const user = await mockRegister(name, login, password, language);
        console.log("Register success:", user);
        // После успешной регистрации можно автоматически войти
        setIsLogin(true);
        setLogin("");
        setPassword("");
        setName("");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      console.error("Ошибка при запросе:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Варианты анимации для элементов
  const inputVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  // Контейнер для stagger
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className=" rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl">
            {isLogin ? "Авторизация" : "Регистрация"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <FieldGroup>
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name"
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Field>
                        <FieldLabel
                          htmlFor="name"
                          className="text-neutral-600 dark:text-white/60"
                        >
                          {t("name")}
                        </FieldLabel>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t("namePlaceholder")}
                          className="border-black/10 bg-white/60 text-neutral-900 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
                          required
                        />
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key="login"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Field>
                    <FieldLabel
                      htmlFor="login"
                      className="text-neutral-600 dark:text-white/60"
                    >
                      {t("loginLabel")}
                    </FieldLabel>
                    <Input
                      id="login"
                      type="text"
                      placeholder={t("loginPlaceholder")}
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="border-black/10 bg-white/60 text-neutral-900 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
                      required
                    />
                  </Field>
                </motion.div>

                <motion.div
                  key="password"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.05 }}
                >
                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="text-neutral-600 dark:text-white/60"
                    >
                      {t("password")}
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-black/10 bg-white/60 text-neutral-900 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
                      required
                    />
                  </Field>
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="language"
                      variants={inputVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                        delay: 0.1,
                      }}
                    >
                      <Field>
                        <FieldLabel htmlFor="language">
                        </FieldLabel>
                        <FieldLabel
                          htmlFor="language"
                          className="text-neutral-600 dark:text-white/60"
                        >
                          {t("language")}
                        </FieldLabel>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger
                            id="language"
                            className="w-full border-black/10 bg-white/60 text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                          >
                            <SelectValue
                              placeholder={t("languagePlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ru">Русский</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key="button"
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.15 }}
                >
                  <Field>
                    <Button
                      type="submit"
                      className="w-full bg-sky-400/80"
                      disabled={isLoading}
                    >

                      {isLogin ? t("submit") : t("submitRegister")}
                    </Button>

                    <FieldDescription className="text-center mt-2 text-neutral-600 dark:text-white/70">
                      {isLogin ? (
                        <>
                          {t("noAccount")}{" "}
                          <button
                            type="button"
                            onClick={toggleForm}
                            className="underline underline-offset-4 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                          >
                            {t("switchToRegister")}
                          </button>
                        </>
                      ) : (
                        <>
                          {t("hasAccount")}{" "}
                          <button
                            type="button"
                            onClick={toggleForm}
                            className="underline underline-offset-4 text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                          >
                            {t("switchToLogin")}
                          </button>
                        </>
                      )}
                    </FieldDescription>
                  </Field>
                </motion.div>
              </FieldGroup>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
