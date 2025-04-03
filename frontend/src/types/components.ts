export interface StyleableComponent {
  className?: string;
}

export interface ParentComponent {
  children: React.ReactNode;
}

export interface ICustomButton extends StyleableComponent {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: EIconPosition;
  onClick?: () => void;
  disabled: boolean;
}

export enum EIconPosition {
  LEFT = "left",
  RIGHT = "right",
}
