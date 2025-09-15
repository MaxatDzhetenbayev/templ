import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCustomMutation } from "@/shared/lib/client";

import { User } from "../../schemas/user.schema";
import { useUser, useUserPermissions } from "../useUser";

// Mock the useCustomMutation hook
vi.mock("@/shared/lib/client", () => ({
  useCustomMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  })),
}));

describe("useUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const OTHER_USER_ID = 999 as const;
  const DEFAULT_ISO_DATE = "2023-01-01T00:00:00Z" as const;

  describe("useUser hook", () => {
    it("should return user mutation functions", () => {
      const { result } = renderHook(() => useUser(1));

      expect(result.current).toHaveProperty("updateUser");
      expect(result.current).toHaveProperty("isUpdating");
      expect(result.current).toHaveProperty("updateError");
      expect(typeof result.current.updateUser).toBe("function");
      expect(typeof result.current.isUpdating).toBe("boolean");
    });

    it("should call updateUser with correct data", async () => {
      const mockMutate = vi.fn();
      const mutationMock = {
        mutate: mockMutate,
        isPending: false,
        error: null,
      } as unknown as ReturnType<typeof useCustomMutation>;

      vi.mocked(useCustomMutation).mockReturnValue(mutationMock);

      const { result } = renderHook(() => useUser(1));

      const updateData = { name: "Updated Name", email: "updated@example.com" };
      result.current.updateUser(updateData);

      expect(mockMutate).toHaveBeenCalledWith(updateData);
    });

    it("should return loading state", async () => {
      const mutationMock = {
        mutate: vi.fn(),
        isPending: true,
        error: null,
      } as unknown as ReturnType<typeof useCustomMutation>;

      vi.mocked(useCustomMutation).mockReturnValue(mutationMock);

      const { result } = renderHook(() => useUser(1));

      expect(result.current.isUpdating).toBe(true);
    });

    it("should return error state", async () => {
      const mockError = new Error("Update failed");
      const mutationMock = {
        mutate: vi.fn(),
        isPending: false,
        error: mockError,
      } as unknown as ReturnType<typeof useCustomMutation>;

      vi.mocked(useCustomMutation).mockReturnValue(mutationMock);

      const { result } = renderHook(() => useUser(1));

      expect(result.current.updateError).toBe(mockError);
    });
  });

  describe("useUserPermissions hook", () => {
    const mockCurrentUser: User = {
      id: 1,
      email: "admin@example.com",
      name: "Admin User",
      avatar: "",
      role: "admin",
      isActive: true,
      createdAt: DEFAULT_ISO_DATE,
      updatedAt: DEFAULT_ISO_DATE,
    };

    const mockRegularUser: User = {
      id: 2,
      email: "user@example.com",
      name: "Regular User",
      avatar: "",
      role: "user",
      isActive: true,
      createdAt: DEFAULT_ISO_DATE,
      updatedAt: DEFAULT_ISO_DATE,
    };

    it("should return permission functions", () => {
      const { result } = renderHook(() => useUserPermissions(mockCurrentUser));

      expect(result.current).toHaveProperty("canEditProfile");
      expect(result.current).toHaveProperty("canDeleteUser");
      expect(result.current).toHaveProperty("canViewUserDetails");
      expect(typeof result.current.canEditProfile).toBe("function");
      expect(typeof result.current.canDeleteUser).toBe("function");
      expect(typeof result.current.canViewUserDetails).toBe("function");
    });

    describe("canEditProfile", () => {
      it("should allow admin to edit any profile", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockCurrentUser)
        );

        expect(result.current.canEditProfile(1)).toBe(true);
        expect(result.current.canEditProfile(2)).toBe(true);
        expect(result.current.canEditProfile(OTHER_USER_ID)).toBe(true);
      });

      it("should allow user to edit their own profile", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockRegularUser)
        );

        expect(result.current.canEditProfile(2)).toBe(true);
      });

      it("should not allow user to edit other profiles", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockRegularUser)
        );

        expect(result.current.canEditProfile(1)).toBe(false);
        expect(result.current.canEditProfile(OTHER_USER_ID)).toBe(false);
      });
    });

    describe("canDeleteUser", () => {
      it("should allow admin to delete other users", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockCurrentUser)
        );

        expect(result.current.canDeleteUser(2)).toBe(true);
        expect(result.current.canDeleteUser(OTHER_USER_ID)).toBe(true);
      });

      it("should not allow admin to delete themselves", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockCurrentUser)
        );

        expect(result.current.canDeleteUser(1)).toBe(false);
      });

      it("should not allow regular user to delete anyone", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockRegularUser)
        );

        expect(result.current.canDeleteUser(1)).toBe(false);
        expect(result.current.canDeleteUser(2)).toBe(false);
        expect(result.current.canDeleteUser(OTHER_USER_ID)).toBe(false);
      });
    });

    describe("canViewUserDetails", () => {
      it("should allow admin to view any user details", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockCurrentUser)
        );

        expect(result.current.canViewUserDetails(1)).toBe(true);
        expect(result.current.canViewUserDetails(2)).toBe(true);
        expect(result.current.canViewUserDetails(OTHER_USER_ID)).toBe(true);
      });

      it("should allow user to view their own details", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockRegularUser)
        );

        expect(result.current.canViewUserDetails(2)).toBe(true);
      });

      it("should not allow user to view other user details", () => {
        const { result } = renderHook(() =>
          useUserPermissions(mockRegularUser)
        );

        expect(result.current.canViewUserDetails(1)).toBe(false);
        expect(result.current.canViewUserDetails(OTHER_USER_ID)).toBe(false);
      });
    });

    it("should handle moderator role correctly", () => {
      const mockModerator: User = {
        ...mockRegularUser,
        id: 3,
        role: "moderator",
      };

      const { result } = renderHook(() => useUserPermissions(mockModerator));

      // Moderator should behave like regular user
      expect(result.current.canEditProfile(3)).toBe(true);
      expect(result.current.canEditProfile(1)).toBe(false);
      expect(result.current.canDeleteUser(1)).toBe(false);
      expect(result.current.canViewUserDetails(3)).toBe(true);
      expect(result.current.canViewUserDetails(1)).toBe(false);
    });
  });
});
