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

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
};

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
    authClient
      .verifyEmail({ query: { token } })
      .then(() => {
        setState("success");
        toast.success("Email đã được xác thực thành công!");
        setTimeout(() => router.push("/"), 2000);
      })
      .catch(() => setState("error"));
  }, [token, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authClient.sendVerificationEmail({
        email: searchParams.get("email") ?? "",
        callbackURL: "/verify-email",
      });
      toast.success("Email xác thực đã được gửi lại!");
      setCooldown(60);
    } catch {
      toast.error("Không thể gửi email. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <h1 className="text-2xl font-bold">Đang xác thực...</h1>
        <p className="text-sm text-muted-foreground">
          Vui lòng chờ trong giây lát
        </p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold">Xác thực thành công!</h1>
        <p className="text-sm text-muted-foreground">
          Email của bạn đã được xác thực. Đang chuyển hướng về trang chủ...
        </p>
        <Button asChild className="mt-2 w-full">
          <Link href="/">Về trang chủ</Link>
        </Button>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Link đã hết hạn</h1>
        <p className="text-sm text-muted-foreground">
          Link xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại
          email.
        </p>
        <div className="flex flex-col w-full gap-2.5 pt-2">
          <Button onClick={handleResend} disabled={isResending || cooldown > 0}>
            {isResending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {cooldown > 0
              ? `Gửi lại sau ${cooldown}s`
              : "Gửi lại email xác thực"}
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Quay lại đăng nhập</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <MailCheck className="h-10 w-10 text-primary" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex inset-0 rounded-full bg-primary opacity-30" />
          <span className="relative inline-flex rounded-full h-5 w-5 bg-primary/50" />
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Kiểm tra email của bạn
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          Chúng tôi đã gửi link xác thực đến email của bạn. Vui lòng kiểm tra
          hộp thư (và thư mục spam) rồi nhấn vào link để kích hoạt tài khoản.
        </p>
      </div>

      <div className="w-full rounded-xl border bg-muted/40 p-4 text-left space-y-2">
        {[
          "Mở ứng dụng email của bạn",
          'Tìm email từ "Staywise"',
          'Nhấn vào nút "Xác thực email"',
        ].map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-muted-foreground"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
              {i + 1}
            </span>
            {step}
          </div>
        ))}
      </div>

      <div className="w-full space-y-2.5">
        <p className="text-xs text-muted-foreground">Không nhận được email?</p>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || cooldown > 0}
        >
          {isResending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại email xác thực"}
        </Button>
        <p className="text-center text-sm">
          <Link
            href="/sign-in"
            className="text-primary hover:underline underline-offset-4"
          >
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
