"use client";

import type { FC } from "react";
import clsx from "clsx";

import type { ICustomButton } from "pec/types/components";
import { EIconPosition } from "pec/types/components";

import { Button } from "../button";

export const PrimaryButton: FC<ICustomButton> = (props) => {
  const { label, className, icon, iconPosition, ...rest } = props;
  return (
    <Button
      className={clsx(
        "text-wrap rounded-full bg-primary text-[13px] leading-[13px] text-white hover:bg-indigo-400 dark:hover:bg-indigo-600",
        className,
      )}
      type="button"
      {...rest}
    >
      {iconPosition === EIconPosition.LEFT && icon}
      {label}
      {iconPosition === EIconPosition.RIGHT && icon}
    </Button>
  );
};
