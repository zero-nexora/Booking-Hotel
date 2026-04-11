"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MailCheck,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type VerifyState = "pending" | "verifying" | "success" | "error";

interface StatusIconProps {
  children: React.ReactNode;
  variant: "default" | "success" | "error" | "warning";
}

const StatusIcon = ({ children, variant }: StatusIconProps) => {
  const cls = {
    default: "bg-primary/10 text-primary",
    success: "bg-primary/15 text-primary",
    error: "bg-destructive/10 text-destructive",
    warning: "bg-secondary text-secondary-foreground",
  }[variant];
  return (
    <div
      className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${cls}`}
    >
      {children}
    </div>
  );
};

const VerifyEmailPage = () => (
  <Suspense
    fallback={
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    }
  >
    <VerifyEmailContent />
  </Suspense>
);

export default VerifyEmailPage;

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(
    token ? "verifying" : "pending",
  );
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!token) return;
    setState("verifying");
    authClient
      .verifyEmail({ query: { token } })
      .then(() => {
        setState("success");
        toast.success("Email đã được xác thực thành công!");
        setTimeout(() => router.push("/sign-in"), 3000);
      })
      .catch((e) => {
        if (e?.status === 429)
          toast.error(e.message || "Quá nhiều yêu cầu, vui lòng thử lại sau");
        else setState("error");
      });
  }, [token, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: searchParams.get("email") ?? "",
        callbackURL: "/verify-email",
      });
      if (error?.status === 429)
        toast.error(error.message || "Quá nhiều yêu cầu, vui lòng thử lại sau");
      else {
        toast.success("Email xác thực đã được gửi lại!");
        setCooldown(60);
      }
    } catch {
      toast.error("Không thể gửi email. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  if (state === "verifying")
    return (
      <div className="space-y-4 text-center">
        <StatusIcon variant="default">
          <Loader2 className="size-6 animate-spin" />
        </StatusIcon>
        <h1 className="text-xl font-semibold text-foreground">
          Đang xác thực...
        </h1>
        <p className="text-sm text-muted-foreground">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    );

  if (state === "success")
    return (
      <div className="space-y-6 text-center">
        <StatusIcon variant="success">
          <CheckCircle2 className="size-6" />
        </StatusIcon>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-foreground">
            Xác thực thành công!
          </h1>
          <p className="text-sm text-muted-foreground">
            Email của bạn đã được xác thực. Đang chuyển hướng về trang chủ...
          </p>
        </div>
        <Button
          asChild
          className="w-full h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    );

  if (state === "error")
    return (
      <div className="space-y-6 text-center">
        <StatusIcon variant="error">
          <XCircle className="size-6" />
        </StatusIcon>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-foreground">
            Link đã hết hạn
          </h1>
          <p className="text-sm text-muted-foreground">
            Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại
            email.
          </p>
        </div>
        <div className="space-y-2">
          <Button
            className="w-full h-10 font-medium gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
          >
            {isResending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}
            {cooldown > 0
              ? `Gửi lại sau ${cooldown}s`
              : "Gửi lại email xác thực"}
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full h-10 text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Link href="/sign-in">Quay lại đăng nhập</Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
          <MailCheck className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-foreground">
            Kiểm tra email của bạn
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chúng tôi đã gửi link xác thực đến email của bạn. Vui lòng kiểm tra
            hộp thư (và thư mục spam) rồi nhấn vào link để kích hoạt tài khoản.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {[
          "Mở ứng dụng email của bạn",
          'Tìm email từ "Staywise"',
          'Nhấn vào nút "Xác thực email"',
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
              {i + 1}
            </span>
            <span className="text-sm text-foreground">{step}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 text-center">
        <p className="text-xs text-muted-foreground">Không nhận được email?</p>
        <Button
          variant="outline"
          className="w-full h-10 gap-2 border-border bg-background text-foreground hover:bg-muted hover:text-foreground font-medium"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
        >
          {isResending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại email xác thực"}
        </Button>
        <Link
          href="/sign-in"
          className="block text-sm text-muted-foreground hover:text-foreground font-medium"
        >
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};
