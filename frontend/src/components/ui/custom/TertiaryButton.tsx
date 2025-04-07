import type { FC } from "react";
import clsx from "clsx";
import { EIconPosition, type ICustomButton } from "pec/types/components";
import { Button } from "../button";

export const TertiaryButton: FC<ICustomButton> = (props) => {
  const { label, onClick, disabled, className, icon, iconPosition } = props;
  return (
    <Button
      className={clsx(
        "rounded-full border border-white text-white hover:cursor-pointer text-wrap text-sm",
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
