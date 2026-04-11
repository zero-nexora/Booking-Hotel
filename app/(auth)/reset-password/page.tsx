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

const inputCls =
  "bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary";
const labelCls =
  "text-xs font-medium uppercase tracking-wide text-muted-foreground";

const ResetPasswordPage = () => (
  <Suspense
    fallback={
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    }
  >
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPasswordPage;

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<PageState>(token ? "idle" : "invalid");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const isLoading = form.formState.isSubmitting;
  const watchedPassword = form.watch("password");

  const onSubmit = async (values: Values) => {
    if (!token) return;
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });
    if (!error) {
      setState("success");
      return;
    }
    if (error.status === 429)
      toast.error(error.message || "Quá nhiều yêu cầu, vui lòng thử lại sau");
    else if (
      error.message?.includes("expired") ||
      error.message?.includes("invalid")
    )
      setState("invalid");
    else toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
  };

  if (state === "invalid")
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-foreground">
            Link không hợp lệ
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Link chỉ có hiệu
            lực trong vòng 1 giờ và chỉ dùng được một lần.
          </p>
        </div>
        <div className="space-y-2">
          <Button
            asChild
            className="w-full h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/forgot-password">Yêu cầu link mới</Link>
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

  if (state === "success")
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <CheckCircle2 className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold text-foreground">
            Mật khẩu đã được đặt lại!
          </h1>
          <p className="text-sm text-muted-foreground">
            Mật khẩu của bạn đã được cập nhật thành công.
          </p>
        </div>
        <Button
          asChild
          className="w-full h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/sign-in">Đăng nhập ngay</Link>
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
          <KeyRound className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Đặt mật khẩu mới
        </h1>
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
                <FormLabel className={labelCls}>Mật khẩu mới</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="new-password"
                    autoFocus
                    disabled={isLoading}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <PasswordStrengthBar password={watchedPassword} />
                <FormDescription className="text-xs text-muted-foreground">
                  Tối thiểu 8 ký tự, gồm chữ hoa và chữ số
                </FormDescription>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-10 font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Đặt lại mật khẩu
          </Button>
        </form>
      </Form>

      <Link
        href="/sign-in"
        className="block text-center text-sm text-muted-foreground hover:text-foreground font-medium"
      >
        ← Quay lại đăng nhập
      </Link>
    </div>
  );
};
