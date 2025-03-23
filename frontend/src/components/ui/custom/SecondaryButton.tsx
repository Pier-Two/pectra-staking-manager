import type { FC } from "react";
import clsx from "clsx";
import { EIconPosition, type ICustomButton } from "pec/types/components";
import { Button } from "../button";

export const SecondaryButton: FC<ICustomButton> = (props) => {
  const { label, onClick, disabled, className, icon, iconPosition } = props;
  return (
    <Button
      className={clsx(
        "rounded-full border border-indigo-300 text-indigo-800 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-gray-900 text-wrap",
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
