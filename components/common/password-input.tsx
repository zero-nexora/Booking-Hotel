"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative flex items-center">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn("pr-10", className)}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
          onClick={() => setShow((v) => !v)}
          disabled={disabled}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
