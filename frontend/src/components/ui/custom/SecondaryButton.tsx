import clsx from "clsx";
import { EIconPosition, type ICustomButton } from "pec/types/components";
import type { FC } from "react";
import { Button } from "../button";

export const SecondaryButton: FC<ICustomButton> = (props) => {
  const { label, onClick, disabled, className, icon, iconPosition } = props;
  return (
    <Button
      variant="ghost"
      className={clsx(
        "text-wrap rounded-full border border-primary/30 text-xs text-piertwoDark-text hover:bg-indigo-100 dark:border-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {iconPosition === EIconPosition.LEFT && icon}
      {label}
      {iconPosition === EIconPosition.RIGHT && icon}
    </Button>
  );
};
