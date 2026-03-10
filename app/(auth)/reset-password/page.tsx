"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/common/password-input";
import { PasswordStrengthBar } from "@/components/common/password-strength-bar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
type Values = z.infer<typeof schema>;

type PageState = "idle" | "invalid" | "success";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<PageState>(token ? "idle" : "invalid");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;
  const watchedPassword = form.watch("password");

  async function onSubmit(values: Values) {
    if (!token) return;
    try {
      await authClient.resetPassword({ newPassword: values.password, token });
      setState("success");
    } catch (error: any) {
      if (
        error?.message?.includes("expired") ||
        error?.message?.includes("invalid")
      ) {
        setState("invalid");
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    }
  }

  if (state === "invalid") {
    return (
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Link không hợp lệ</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Link chỉ có hiệu
            lực trong vòng 1 giờ và chỉ dùng được một lần.
          </p>
        </div>
        <div className="w-full space-y-2.5">
          <Button asChild className="w-full">
            <Link href="/forgot-password">Yêu cầu link mới</Link>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/sign-in">Quay lại đăng nhập</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Mật khẩu đã được đặt lại!</h1>
          <p className="text-sm text-muted-foreground">
            Mật khẩu của bạn đã được cập nhật thành công.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/sign-in">Đăng nhập ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Đặt mật khẩu mới</h1>
        <p className="text-sm text-muted-foreground">
          Mật khẩu mới phải khác với mật khẩu trước đó.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="new-password"
                    autoFocus
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <PasswordStrengthBar password={watchedPassword} />
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
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    {...field}
                  />
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
