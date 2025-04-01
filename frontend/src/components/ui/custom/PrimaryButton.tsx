import type { FC } from "react";
import clsx from "clsx";
import { EIconPosition, type ICustomButton } from "pec/types/components";
import { Button } from "../button";

export const PrimaryButton: FC<ICustomButton> = (props) => {
  const { label, onClick, disabled, className, icon, iconPosition } = props;
  return (
    <Button
      className={clsx(
        "rounded-full bg-indigo-500 text-white hover:bg-indigo-400 dark:hover:bg-indigo-600 text-wrap text-sm",
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
