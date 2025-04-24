import type { Meta, StoryObj } from "@storybook/react";
import { WithdrawalInformation } from "./WithdrawalInformation";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Withdrawals/WithdrawalInformation",
  component: WithdrawalInformation,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof WithdrawalInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    buttonText: "Withdraw",
    handleMaxAllocation: () => {},
    disabled: false,
    onSubmit: () => {},
    resetWithdrawal: () => {},
    validatorsSelected: 8,
    withdrawalTotal: 100,
    stage: { type: "data-capture" },
  },
};
