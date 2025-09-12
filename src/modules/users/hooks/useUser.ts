import { useCustomMutation } from "@/shared/lib/client";
import { User, UpdateUser } from "../schemas/user.schema";
import {
  USER_SUCCESS_MESSAGES,
  USER_ERROR_MESSAGES,
} from "../constants/user.constants";

/**
 * Хук для работы с пользователем
 */
export const useUser = (userId: number) => {
  /**
   * Обновление данных пользователя
   */
  const updateUserMutation = useCustomMutation({
    mutationFn: (data: UpdateUser) => {
      return Promise.resolve(data);
    }, // Временное решение для примера
    toastConfig: {
      successMessage: USER_SUCCESS_MESSAGES.UPDATED,
      errorMessage: USER_ERROR_MESSAGES.NOT_FOUND,
    },
    customConfig: {
      invalidateQueries: [["users"], ["user", userId]],
      onSuccess: (data) => {
        console.log("User updated:", data);
      },
    },
  });

  return {
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    updateError: updateUserMutation.error,
  };
};

/**
 * Хук для проверки прав пользователя
 */
export const useUserPermissions = (currentUser: User) => {
  const canEditProfile = (targetUserId: number) => {
    return currentUser.id === targetUserId || currentUser.role === "admin";
  };

  const canDeleteUser = (targetUserId: number) => {
    return currentUser.role === "admin" && currentUser.id !== targetUserId;
  };

  const canViewUserDetails = (targetUserId: number) => {
    return currentUser.id === targetUserId || currentUser.role === "admin";
  };

  return {
    canEditProfile,
    canDeleteUser,
    canViewUserDetails,
  };
};
