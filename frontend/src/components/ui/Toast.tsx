"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { isValidElement } from "react";
import { type Action, type ExternalToast, toast as sonnerToast } from "sonner";
import { v4 } from "uuid";

import { Button } from "./button";
import { PectraSpinner } from "./custom/pectraSpinner";

const toastVariants = cva(
  "group pointer-events-auto relative border border-gray-200 dark:border-gray-800 flex w-[90vw] max-w-[400px] items-center justify-between overflow-hidden bg-gray-50 dark:bg-black rounded-md p-4 shadow-lg shadow-[#cecfdb80] dark:shadow-[#00000080] transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "",
        success: "",
        error: "",
        loading: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function toast({
  description,
  title,
  action,
  variant,
  id,
  duration = 5000,
  ...props
}: ToastProps) {
  const toastId = id ?? v4();
  return sonnerToast.custom(
    (id) => (
      <Toast
        id={id}
        {...props}
        description={description}
        title={title}
        action={action}
        variant={variant}
        duration={duration}
      />
    ),
    {
      ...props,
      id: toastId,
      duration,
    },
  );
}

export const dismissToast = (id: string) => sonnerToast.dismiss(id);

/** A fully custom toast that still maintains the animations and interactions. */
const Toast = (
  props: ToastProps & { id: string | number; duration?: number },
) => {
  const { title, description, action, variant, onDismiss, id } = props;

  return (
    <div className={toastVariants({ variant })}>
      <div className="flex flex-1 flex-row items-center space-x-3">
        {variant === "loading" && <PectraSpinner />}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-semibold dark:text-gray-400">{title}</p>
            {typeof description === "function" ? (
              description()
            ) : (
              <p className="line-clamp-3 break-words text-xs opacity-90 dark:text-gray-500">
                {description}
              </p>
            )}
          </div>
          {action &&
            (isValidElement(action) ? (
              action
            ) : (
              <Button
                className="inline-flex h-auto shrink-0 items-center justify-center rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-gray-700"
                variant="ghost"
                onClick={(e) => {
                  (action as Action).onClick(e);
                }}
              >
                {(action as Action).label}
              </Button>
            ))}
        </div>
      </div>
      <Button
        onClick={() => {
          sonnerToast.dismiss(id);
          onDismiss?.(props);
        }}
        variant="ghost"
        className="absolute right-1 top-0 h-auto rounded-md border-none bg-transparent p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100 dark:text-gray-400"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export type ToastProps = {
  title: string;
  duration?: number; // optional prop for controlling the duration of the toast
} & ExternalToast &
  VariantProps<typeof toastVariants>;
