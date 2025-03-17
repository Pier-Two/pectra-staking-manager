import type { Meta, StoryObj } from "@storybook/react";
import { SelectSourceValidators } from "./SelectSourceValidators";
import { MOCK_VALIDATORS } from "pec/server/__mocks__/validators";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Consolidation/Source/SelectSourceValidators",
  component: SelectSourceValidators,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof SelectSourceValidators>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    destinationValidator: MOCK_VALIDATORS[0]!,
    selectedSourceTotal: 0,
    setProgress: () => {},
    setSelectedDestinationValidator: () => {},
    setSelectedSourceTotal: () => {},
    selectedSourceValidators: [],
    setSelectedSourceValidators: () => {},
    validators: MOCK_VALIDATORS,
  },
};
