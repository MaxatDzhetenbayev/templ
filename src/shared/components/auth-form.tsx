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
import { useState } from "react";
import { mockLogin, mockRegister } from "../lib/mock-auth";

export function AuthForm({ className, ...props }: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("ru");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

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
      <Card className=" rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl text-white">
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
                        <FieldLabel htmlFor="name">Имя</FieldLabel>
                        <Input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Введите имя"
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
                    <FieldLabel htmlFor="login">Логин</FieldLabel>
                    <Input
                      id="login"
                      type="text"
                      placeholder="Введите логин"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
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
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                          Выберите язык
                        </FieldLabel>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Выберите язык" />
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
                      {isLoading
                        ? "Загрузка..."
                        : isLogin
                        ? "Войти"
                        : "Зарегистрироваться"}
                    </Button>

                    <FieldDescription className="text-center mt-2">
                      {isLogin ? (
                        <>
                          Нет аккаунта?{" "}
                          <button
                            type="button"
                            onClick={toggleForm}
                            className="underline underline-offset-4 hover:text-sky-600"
                          >
                            Зарегистрироваться
                          </button>
                        </>
                      ) : (
                        <>
                          Уже есть аккаунт?{" "}
                          <button
                            type="button"
                            onClick={toggleForm}
                            className="underline underline-offset-4 hover:text-sky-600"
                          >
                            Войти
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
