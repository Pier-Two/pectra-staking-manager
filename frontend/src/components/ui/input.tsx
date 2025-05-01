import * as React from "react";

import { cn } from "pec/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  autoFocusOn?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoFocusOn, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Compose forwarded ref with local ref
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Focus the input when the component is mounted
    React.useEffect(() => {
      if (autoFocusOn && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocusOn]);

    // Prevent the wheel event / trackpad from changing the value of the input
    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
      if (type === "number") {
        e.currentTarget.blur();
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={inputRef}
        onWheel={handleWheel}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
