import { describe, expect, it } from "vitest";

import { User } from "../../schemas/user.schema";
import {
  canEditUser,
  formatUserCreatedDate,
  generateAvatarColor,
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
  isAdmin,
} from "../user.utils";

describe("user.utils", () => {
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    name: "John Doe",
    avatar: "",
    role: "user",
    isActive: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  };

  const mockAdminUser: User = {
    ...mockUser,
    id: 2,
    role: "admin",
  };

  describe("getUserDisplayName", () => {
    it("should return user name when available", () => {
      const result = getUserDisplayName(mockUser);
      expect(result).toBe("John Doe");
    });

    it("should return email prefix when name is not available", () => {
      const userWithoutName = { ...mockUser, name: "" };
      const result = getUserDisplayName(userWithoutName);
      expect(result).toBe("test");
    });

    it("should handle email without @ symbol", () => {
      const userWithInvalidEmail = {
        ...mockUser,
        name: "",
        email: "invalid-email",
      };
      const result = getUserDisplayName(userWithInvalidEmail);
      expect(result).toBe("invalid-email");
    });
  });

  describe("getUserInitials", () => {
    it("should return initials from full name", () => {
      const result = getUserInitials(mockUser);
      expect(result).toBe("JD");
    });

    it("should return first two characters when single name", () => {
      const userWithSingleName = { ...mockUser, name: "John" };
      const result = getUserInitials(userWithSingleName);
      expect(result).toBe("JO");
    });

    it("should handle empty name", () => {
      const userWithoutName = { ...mockUser, name: "" };
      const result = getUserInitials(userWithoutName);
      expect(result).toBe("TE");
    });

    it("should handle multiple words in name", () => {
      const userWithLongName = { ...mockUser, name: "John Michael Doe Smith" };
      const result = getUserInitials(userWithLongName);
      expect(result).toBe("JM");
    });
  });

  describe("isAdmin", () => {
    it("should return true for admin user", () => {
      const result = isAdmin(mockAdminUser);
      expect(result).toBe(true);
    });

    it("should return false for regular user", () => {
      const result = isAdmin(mockUser);
      expect(result).toBe(false);
    });

    it("should return false for moderator user", () => {
      const moderatorUser = { ...mockUser, role: "moderator" as const };
      const result = isAdmin(moderatorUser);
      expect(result).toBe(false);
    });
  });

  describe("canEditUser", () => {
    it("should allow admin to edit any user", () => {
      const result = canEditUser(mockAdminUser, mockUser);
      expect(result).toBe(true);
    });

    it("should allow user to edit themselves", () => {
      const result = canEditUser(mockUser, mockUser);
      expect(result).toBe(true);
    });

    it("should not allow user to edit other users", () => {
      const otherUser = { ...mockUser, id: 3 };
      const result = canEditUser(mockUser, otherUser);
      expect(result).toBe(false);
    });

    it("should allow admin to edit themselves", () => {
      const result = canEditUser(mockAdminUser, mockAdminUser);
      expect(result).toBe(true);
    });
  });

  describe("getUserAvatarUrl", () => {
    it("should return user avatar when available", () => {
      const userWithAvatar = { ...mockUser, avatar: "/custom-avatar.jpg" };
      const result = getUserAvatarUrl(userWithAvatar);
      expect(result).toBe("/custom-avatar.jpg");
    });

    it("should return default neutral avatar when no avatar", () => {
      const result = getUserAvatarUrl(mockUser);
      expect(result).toBe("/avatars/default-neutral.png");
    });

    it("should return default neutral avatar when avatar is empty string", () => {
      const userWithEmptyAvatar = { ...mockUser, avatar: "" };
      const result = getUserAvatarUrl(userWithEmptyAvatar);
      expect(result).toBe("/avatars/default-neutral.png");
    });
  });

  describe("formatUserCreatedDate", () => {
    it("should format date correctly in Russian locale", () => {
      const result = formatUserCreatedDate(mockUser);
      expect(result).toBe("1 января 2023 г.");
    });

    it("should handle different dates", () => {
      const userWithDifferentDate = {
        ...mockUser,
        createdAt: "2022-12-25T10:30:00Z",
      };
      const result = formatUserCreatedDate(userWithDifferentDate);
      expect(result).toBe("25 декабря 2022 г.");
    });
  });

  describe("generateAvatarColor", () => {
    it("should return consistent color for same user ID", () => {
      const color1 = generateAvatarColor(1);
      const color2 = generateAvatarColor(1);
      expect(color1).toBe(color2);
    });

    it("should return different colors for different user IDs", () => {
      const color1 = generateAvatarColor(1);
      const color2 = generateAvatarColor(2);
      expect(color1).not.toBe(color2);
    });

    it("should return valid hex color", () => {
      const color = generateAvatarColor(1);
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should handle large user IDs", () => {
      const color = generateAvatarColor(999999);
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it("should handle zero user ID", () => {
      const color = generateAvatarColor(0);
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});
