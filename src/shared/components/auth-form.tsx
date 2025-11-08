'use client'

import { useState } from "react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select"
import axios from "axios"
import { axiosApi } from "../lib/client"



export function AuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // 👇 Состояние: login или register
  const [name, setName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [login, setLogin]= useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState('ru')
  const toggleForm = () => setIsLogin(!isLogin)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        // Авторизация
        const res = await axiosApi.post("/auth/login", {
          login,
          password,
        })
        console.log("Login success:", res.data)
      } else {
        // Регистрация
        const res = await axiosApi.post(`/auth/register`, {
          name,
          login,
          password,
          language,
        })
        console.log("Register success:", res.data)
      }
    } catch (err) {
      console.error("Ошибка при запросе:", err)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? "Авторизация" : "Регистрация"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              {/* --- Если форма регистрации --- */}
              {!isLogin && (
                <>
                  <Field>
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) =>setName(e.target.value)}
                      placeholder="Введите имя"
                      required
                    />
                  </Field>
                </>
              )}

              {/* Общее поле логина */}
              <Field>
                <FieldLabel htmlFor="login">Логин</FieldLabel>
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) =>setLogin(e.target.value)}
                  required
                />
              </Field>

              {/* Пароль — есть в обеих формах */}
              <Field>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) =>setPassword(e.target.value)}
                  required
                />
              </Field>

              {/* --- Дополнительные поля для регистрации --- */}
              {!isLogin && (
                <>
                  <Field>
                    <FieldLabel htmlFor="language">Выберите язык</FieldLabel>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Выберите язык" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kk">Қазақ тілі</SelectItem>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              )}

              {/* --- Кнопка --- */}
              <Field>
                <Button type="submit" onClick={handleSubmit} className="w-full">
                  {isLogin ? "Войти" : "Зарегистрироваться"}
                </Button>

                {/* Ссылка для переключения */}
                <FieldDescription className="text-center mt-2">
                  {isLogin ? (
                    <>
                      Нет аккаунта?{" "}
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="underline underline-offset-4 hover:text-blue-600"
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
                        className="underline underline-offset-4 hover:text-blue-600"
                      >
                        Войти
                      </button>
                    </>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
