import { User } from "@/modules/users/schemas/user.schema";
import { USER_ROLES } from "@/modules/users/constants/user.constants";
import { DEFAULT_AVATARS } from "@/modules/users/constants/user.constants";

/**
 * Получает отображаемое имя пользователя
 */
export const getUserDisplayName = (user: User): string => {
  return user.name || user.email.split("@")[0];
};

/**
 * Получает инициалы пользователя
 */
export const getUserInitials = (user: User): string => {
  const name = getUserDisplayName(user);
  const words = name.split(" ");

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
};

/**
 * Проверяет, является ли пользователь администратором
 */
export const isAdmin = (user: User): boolean => {
  return user.role === USER_ROLES.ADMIN;
};

/**
 * Проверяет, может ли пользователь редактировать другого пользователя
 */
export const canEditUser = (currentUser: User, targetUser: User): boolean => {
  // Админ может редактировать всех
  if (isAdmin(currentUser)) return true;

  // Пользователь может редактировать только себя
  return currentUser.id === targetUser.id;
};

/**
 * Получает URL аватара пользователя
 */
export const getUserAvatarUrl = (user: User): string => {
  if (user.avatar) return user.avatar;

  // Возвращаем нейтральный аватар по умолчанию
  return DEFAULT_AVATARS.NEUTRAL;
};

/**
 * Форматирует дату создания пользователя
 */
export const formatUserCreatedDate = (user: User): string => {
  const date = new Date(user.createdAt);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Генерирует случайный цвет для аватара
 */
export const generateAvatarColor = (userId: number): string => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
  ];

  return colors[userId % colors.length];
};
