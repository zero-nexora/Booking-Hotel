"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const forgotSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: ForgotValues) {
    try {
      await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });
      setSubmittedEmail(values.email);
      setIsSuccess(true);
    } catch (error) {
      // Don't reveal whether email exists - show success either way for security
      setSubmittedEmail(values.email);
      setIsSuccess(true);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Send className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Đã gửi email!</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nếu tài khoản với email{" "}
              <span className="font-medium text-foreground">
                {submittedEmail}
              </span>{" "}
              tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong vài
              phút tới.
            </p>
          </div>

          {/* Info box */}
          <div className="w-full rounded-lg border bg-muted/40 p-4 text-left space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Lưu ý
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Kiểm tra cả thư mục Spam / Junk</li>
              <li>• Link có hiệu lực trong 1 giờ</li>
              <li>• Chỉ dùng được một lần</li>
            </ul>
          </div>

          <div className="w-full space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSuccess(false);
                form.reset();
              }}
            >
              Gửi lại email khác
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quên mật khẩu?
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
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
            Gửi link đặt lại mật khẩu
          </Button>
        </form>
      </Form>

      {/* Back to login */}
      <Button variant="ghost" asChild className="w-full">
        <Link href="/sign-in">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </Button>
    </div>
  );
}

export default ForgotPasswordPage;