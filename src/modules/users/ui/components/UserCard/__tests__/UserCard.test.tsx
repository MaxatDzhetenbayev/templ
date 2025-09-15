import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { User } from "../../../../schemas/user.schema";
import { UserCard } from "../UserCard";

describe("UserCard", () => {
  const ACTION_BUTTONS = ["Просмотр", "Редактировать", "Удалить"] as const;

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

  const mockInactiveUser: User = {
    ...mockUser,
    id: 3,
    isActive: false,
  };

  it("should render user information correctly", () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Пользователь")).toBeInTheDocument();
    expect(screen.getByText("Активен")).toBeInTheDocument();
    expect(screen.getByText(/Зарегистрирован:/)).toBeInTheDocument();
  });

  it("should render admin user with correct role label", () => {
    render(<UserCard user={mockAdminUser} />);

    expect(screen.getByText("Администратор")).toBeInTheDocument();
  });

  it("should render inactive user with correct status", () => {
    render(<UserCard user={mockInactiveUser} />);

    expect(screen.getByText("Неактивен")).toBeInTheDocument();
  });

  it("should render action buttons when showActions is true", () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserCard
        user={mockUser}
        showActions
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    ACTION_BUTTONS.forEach((buttonText) => {
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });
  });

  it("should not render action buttons when showActions is false", () => {
    render(<UserCard user={mockUser} showActions={false} />);

    ACTION_BUTTONS.forEach((buttonText) => {
      expect(screen.queryByText(buttonText)).not.toBeInTheDocument();
    });
  });

  it("should call onView when view button is clicked", () => {
    const onView = vi.fn();

    render(<UserCard user={mockUser} onView={onView} />);

    fireEvent.click(screen.getByText(ACTION_BUTTONS[0]));
    expect(onView).toHaveBeenCalledWith(mockUser);
  });

  it("should call onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();

    render(<UserCard user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByText(ACTION_BUTTONS[1]));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it("should call onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();

    render(<UserCard user={mockUser} onDelete={onDelete} />);

    fireEvent.click(screen.getByText(ACTION_BUTTONS[2]));
    expect(onDelete).toHaveBeenCalledWith(mockUser);
  });

  it("should only render available action buttons", () => {
    const onView = vi.fn();

    render(<UserCard user={mockUser} onView={onView} />);

    expect(screen.getByText(ACTION_BUTTONS[0])).toBeInTheDocument();
    expect(screen.queryByText(ACTION_BUTTONS[1])).not.toBeInTheDocument();
    expect(screen.queryByText(ACTION_BUTTONS[2])).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(<UserCard user={mockUser} className="custom-class" />);

    const cardElement = screen.getByText("John Doe").closest(".bg-white");
    expect(cardElement).toHaveClass("custom-class");
  });

  it("should render user avatar", () => {
    const { container } = render(<UserCard user={mockUser} />);

    // UserAvatar component should render with default avatar
    const avatarContainer = container.querySelector(
      'div[style*="background-image"]'
    );
    expect(avatarContainer).toBeInTheDocument();
  });

  it("should handle user without name (fallback to email)", () => {
    const userWithoutName = { ...mockUser, name: "" };
    render(<UserCard user={userWithoutName} />);

    expect(screen.getByText("test")).toBeInTheDocument(); // Email prefix
  });

  it("should render moderator role correctly", () => {
    const moderatorUser = { ...mockUser, role: "moderator" as const };
    render(<UserCard user={moderatorUser} />);

    expect(screen.getByText("Модератор")).toBeInTheDocument();
  });

  it("should format created date correctly", () => {
    render(<UserCard user={mockUser} />);

    expect(
      screen.getByText("Зарегистрирован: 1 января 2023 г.")
    ).toBeInTheDocument();
  });

  it("should handle all action callbacks together", () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <UserCard
        user={mockUser}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByText(ACTION_BUTTONS[0]));
    fireEvent.click(screen.getByText(ACTION_BUTTONS[1]));
    fireEvent.click(screen.getByText(ACTION_BUTTONS[2]));

    expect(onView).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
