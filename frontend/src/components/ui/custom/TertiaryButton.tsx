import type { FC } from "react";
import clsx from "clsx";
import { EIconPosition, type ICustomButton } from "pec/types/components";
import { Button } from "../button";

export const TertiaryButton: FC<ICustomButton> = (props) => {
  const { label, onClick, disabled, className, icon, iconPosition } = props;
  return (
    <Button
      className={clsx(
        "text-wrap rounded-full border border-white bg-transparent text-sm font-570 text-primary-dark hover:cursor-pointer hover:bg-indigo-100 dark:text-indigo-200 hover:dark:bg-primary-dark/20",
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
