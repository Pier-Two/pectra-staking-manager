import { cn } from "pec/lib/utils"
import * as React from "react"

interface InputProps extends React.ComponentProps<"input"> {
  autoFocusOn?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoFocusOn, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Compose forwarded ref with local ref
    React.useImperativeHandle(ref, () => inputRef.current!)

    React.useEffect(() => {
      if (autoFocusOn && inputRef.current) {
        inputRef.current.focus()
      }
    }, [autoFocusOn])

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={inputRef}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
