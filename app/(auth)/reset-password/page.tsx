"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff, KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

type PageState = "idle" | "loading" | "invalid" | "success";

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;

  const colors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const labels = ["Yếu", "Trung bình", "Khá", "Mạnh"];

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? colors[strength - 1] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Độ mạnh:{" "}
        <span className="font-medium">
          {strength > 0 ? labels[strength - 1] : ""}
        </span>
      </p>
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>(
    token ? "idle" : "invalid"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const watchedPassword = form.watch("password");
  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: ResetValues) {
    if (!token) return;

    try {
      await authClient.resetPassword({
        newPassword: values.password,
        token,
      });
      setPageState("success");
    } catch (error: any) {
      if (error?.message?.includes("expired") || error?.message?.includes("invalid")) {
        setPageState("invalid");
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    }
  }

  // Invalid / expired token
  if (pageState === "invalid") {
    return (
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Link không hợp lệ</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Link chỉ có
            hiệu lực trong vòng 1 giờ và chỉ dùng được một lần.
          </p>
        </div>
        <div className="w-full space-y-3">
          <Button asChild className="w-full">
            <Link href="/forgot-password">Yêu cầu link mới</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/login">Quay lại đăng nhập</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (pageState === "success") {
    return (
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Mật khẩu đã được đặt lại!</h1>
          <p className="text-sm text-muted-foreground">
            Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng nhập
            bằng mật khẩu mới.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Đặt mật khẩu mới</h1>
        <p className="text-sm text-muted-foreground">
          Mật khẩu mới phải khác với mật khẩu trước đó.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      autoFocus
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                {watchedPassword && (
                  <PasswordStrengthBar password={watchedPassword} />
                )}
                <FormDescription className="text-xs">
                  Tối thiểu 8 ký tự, gồm chữ hoa và chữ số
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirm(!showConfirm)}
                      disabled={isLoading}
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đặt lại mật khẩu
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/sign-in"
          className="text-primary hover:underline underline-offset-4"
        >
          ← Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}