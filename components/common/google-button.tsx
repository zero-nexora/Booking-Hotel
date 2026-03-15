"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import GoogleIcon from "../../public/images/google.svg";
import Image from "next/image";

interface GoogleButtonProps {
  label?: string;
  disabled?: boolean;
}

export const GoogleButton = ({
  label = "Tiếp tục với Google",
  disabled = false,
}: GoogleButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-10 gap-2.5 border-border bg-background text-foreground hover:bg-accent hover:text-secondary-foreground font-medium text-sm"
      onClick={handleClick}
      disabled={disabled || loading}
      type="button"
    >
      {loading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <Image
          src={GoogleIcon}
          alt="google-icon"
          width={18}
          height={18}
          className="shrink-0"
        />
      )}
      {label}
    </Button>
  );
};
