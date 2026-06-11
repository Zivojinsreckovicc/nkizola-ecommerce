"use client";

import { useFormStatus } from "react-dom";

type Props = React.ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Working…",
  disabled = false,
  className = "",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
}
