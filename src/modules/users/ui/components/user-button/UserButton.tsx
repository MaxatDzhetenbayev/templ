"use client";

import React from "react";

export type UserButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export const UserButton: React.FC<UserButtonProps> = ({
  label,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center rounded-md border",
        "px-3 py-2 text-sm font-medium",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100",
        className ?? "",
      ].join(" ")}
    >
      {label}
    </button>
  );
};
