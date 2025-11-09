/**
 * Моковая реализация аутентификации с использованием localStorage
 */

const STORAGE_KEY = "mock_users";
const CURRENT_USER_KEY = "mock_current_user";

export interface MockUser {
  id: string;
  name: string;
  login: string;
  password: string;
  language: string;
  createdAt: string;
}

/**
 * Получает всех пользователей из localStorage
 *
 * @returns Массив пользователей
 */
export const getUsers = (): MockUser[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Сохраняет пользователей в localStorage
 *
 * @param users - Массив пользователей для сохранения
 */
const saveUsers = (users: MockUser[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

/**
 * Находит пользователя по логину
 *
 * @param login - Логин пользователя
 * @returns Найденный пользователь или undefined
 */
const findUserByLogin = (login: string): MockUser | undefined => {
  const users = getUsers();
  return users.find((user) => user.login === login);
};

/**
 * Моковая функция регистрации пользователя
 *
 * @param name - Имя пользователя
 * @param login - Логин пользователя
 * @param password - Пароль пользователя
 * @param language - Язык пользователя
 * @returns Promise с данными пользователя
 * @throws {Error} Если пользователь с таким логином уже существует
 */
export const mockRegister = async (
  name: string,
  login: string,
  password: string,
  language: string
): Promise<MockUser> => {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));

  const existingUser = findUserByLogin(login);
  if (existingUser) {
    throw new Error("Пользователь с таким логином уже существует");
  }

  const newUser: MockUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    login,
    password, // В реальном приложении пароль должен быть захеширован
    language,
    createdAt: new Date().toISOString(),
  };

  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  return newUser;
};

/**
 * Моковая функция входа пользователя
 *
 * @param login - Логин пользователя
 * @param password - Пароль пользователя
 * @returns Promise с данными пользователя
 * @throws {Error} Если логин или пароль неверны
 */
export const mockLogin = async (
  login: string,
  password: string
): Promise<MockUser> => {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = findUserByLogin(login);
  if (!user) {
    throw new Error("Пользователь с таким логином не найден");
  }

  if (user.password !== password) {
    throw new Error("Неверный пароль");
  }

  // Сохраняем текущего пользователя
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  return user;
};

/**
 * Получает текущего авторизованного пользователя
 *
 * @returns Текущий пользователь или null
 */
export const getCurrentUser = (): MockUser | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

/**
 * Выход из системы
 */
export const mockLogout = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
};
