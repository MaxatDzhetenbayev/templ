import type { Meta, StoryObj } from "@storybook/react";
import { UserButton, type UserButtonProps } from "./UserButton";

const meta: Meta<typeof UserButton> = {
  title: "Modules/Users/UserButton",
  component: UserButton,
  args: {
    label: "Open profile",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof UserButton>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithHandler: Story = {
  args: {
    onClick: () => {
      // eslint-disable-next-line no-alert
      alert("User button clicked");
    },
  },
};
