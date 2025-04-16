import type { ButtonProps } from "pec/components/ui/button";
export interface StyleableComponent {
  className?: string;
}
export interface ParentComponent {
  children: React.ReactNode;
}
export interface ICustomButton extends ButtonProps {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: EIconPosition;
}

export enum EIconPosition {
  LEFT = "left",
  RIGHT = "right",
}
