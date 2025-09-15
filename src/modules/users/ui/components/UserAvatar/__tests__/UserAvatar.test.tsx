import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { User } from "../../../../schemas/user.schema";
import { UserAvatar } from "../UserAvatar";

describe("UserAvatar", () => {
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

  const mockUserWithAvatar: User = {
    ...mockUser,
    avatar: "/custom-avatar.jpg",
  };

  const mockUserWithNonImageAvatar: User = {
    ...mockUser,
    avatar: "data:text/plain;base64,test", // Non-image URL should show initials
  };

  it("should render default avatar when no avatar provided", () => {
    const { container } = render(<UserAvatar user={mockUser} />);

    // Since getUserAvatarUrl returns a default avatar path, we check for the background image
    const avatarContainer = container.querySelector(
      'div[style*="background-image"]'
    );
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer).toHaveStyle({
      backgroundImage: "url(/avatars/default-neutral.png)",
    });
  });

  it("should render avatar image when avatar URL provided", () => {
    const { container } = render(<UserAvatar user={mockUserWithAvatar} />);

    const avatarContainer = container.querySelector(
      'div[style*="background-image"]'
    );
    expect(avatarContainer).toHaveStyle({
      backgroundImage: "url(/custom-avatar.jpg)",
    });
  });

  it("should render user initials when avatar is not an image path", () => {
    render(<UserAvatar user={mockUserWithNonImageAvatar} />);

    const avatarElement = screen.getByText("JD");
    expect(avatarElement).toBeInTheDocument();
  });

  it("should apply correct size classes", () => {
    const { rerender, container } = render(
      <UserAvatar user={mockUser} size="sm" />
    );

    let avatarContainer = container.querySelector('div[class*="w-8"]');
    expect(avatarContainer).toHaveClass("w-8", "h-8", "text-xs");

    rerender(<UserAvatar user={mockUser} size="md" />);
    avatarContainer = container.querySelector('div[class*="w-10"]');
    expect(avatarContainer).toHaveClass("w-10", "h-10", "text-sm");

    rerender(<UserAvatar user={mockUser} size="lg" />);
    avatarContainer = container.querySelector('div[class*="w-12"]');
    expect(avatarContainer).toHaveClass("w-12", "h-12", "text-base");

    rerender(<UserAvatar user={mockUser} size="xl" />);
    avatarContainer = container.querySelector('div[class*="w-16"]');
    expect(avatarContainer).toHaveClass("w-16", "h-16", "text-lg");
  });

  it("should use medium size by default", () => {
    const { container } = render(<UserAvatar user={mockUser} />);

    const avatarContainer = container.querySelector('div[class*="w-10"]');
    expect(avatarContainer).toHaveClass("w-10", "h-10", "text-sm");
  });

  it("should show online indicator when showOnline is true and user is online", () => {
    const { container } = render(
      <UserAvatar user={mockUser} showOnline isOnline />
    );

    const onlineIndicator = container.querySelector(".bg-green-500");
    expect(onlineIndicator).toBeInTheDocument();
  });

  it("should show offline indicator when showOnline is true and user is offline", () => {
    const { container } = render(
      <UserAvatar user={mockUser} showOnline isOnline={false} />
    );

    const offlineIndicator = container.querySelector(".bg-gray-400");
    expect(offlineIndicator).toBeInTheDocument();
  });

  it("should not show online indicator when showOnline is false", () => {
    const { container } = render(
      <UserAvatar user={mockUser} showOnline={false} isOnline />
    );

    const onlineIndicator = container.querySelector(".bg-green-500");
    const offlineIndicator = container.querySelector(".bg-gray-400");

    expect(onlineIndicator).not.toBeInTheDocument();
    expect(offlineIndicator).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <UserAvatar user={mockUser} className="custom-class" />
    );

    const avatarContainer = container.querySelector(".custom-class");
    expect(avatarContainer).toBeInTheDocument();
  });

  it("should generate consistent background color for same user ID", () => {
    const { rerender } = render(
      <UserAvatar user={mockUserWithNonImageAvatar} />
    );

    const firstRender = screen.getByText("JD").parentElement;
    const firstBackgroundColor = firstRender?.style.backgroundColor;

    rerender(<UserAvatar user={mockUserWithNonImageAvatar} />);

    const secondRender = screen.getByText("JD").parentElement;
    const secondBackgroundColor = secondRender?.style.backgroundColor;

    expect(firstBackgroundColor).toBe(secondBackgroundColor);
  });

  it("should handle user with single name", () => {
    const userWithSingleName = { ...mockUserWithNonImageAvatar, name: "John" };
    render(<UserAvatar user={userWithSingleName} />);

    const avatarElement = screen.getByText("JO");
    expect(avatarElement).toBeInTheDocument();
  });

  it("should handle user without name (fallback to email)", () => {
    const userWithoutName = { ...mockUserWithNonImageAvatar, name: "" };
    render(<UserAvatar user={userWithoutName} />);

    const avatarElement = screen.getByText("TE");
    expect(avatarElement).toBeInTheDocument();
  });

  it("should handle user with multiple names", () => {
    const userWithMultipleNames = {
      ...mockUserWithNonImageAvatar,
      name: "John Michael Doe Smith",
    };
    render(<UserAvatar user={userWithMultipleNames} />);

    const avatarElement = screen.getByText("JM");
    expect(avatarElement).toBeInTheDocument();
  });
});
