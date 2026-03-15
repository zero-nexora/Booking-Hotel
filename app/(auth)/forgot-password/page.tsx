"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

const schema = z.object({ email: z.string().email("Email không hợp lệ") });
type Values = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: Values) => {
    try {
      await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });
    } catch {
    } finally {
      setSubmittedEmail(values.email);
      setIsSuccess(true);
    }
  };

  if (isSuccess)
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Send className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold text-foreground">
              Đã gửi email!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nếu tài khoản với email{" "}
              <span className="font-medium text-foreground">
                {submittedEmail}
              </span>{" "}
              tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong vài
              phút tới.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">
            Lưu ý
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-muted-foreground/50 shrink-0" />
              Kiểm tra cả thư mục Spam / Junk
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-muted-foreground/50 shrink-0" />
              Link có hiệu lực trong 1 giờ
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-muted-foreground/50 shrink-0" />
              Chỉ dùng được một lần
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full h-10 border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground font-medium"
            onClick={() => {
              setIsSuccess(false);
              form.reset();
            }}
          >
            Gửi lại email khác
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full h-10 text-muted-foreground hover:text-foreground gap-2"
          >
            <Link href="/sign-in">
              <ArrowLeft className="size-4" />
              Quay lại đăng nhập
            </Link>
          </Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
          <Mail className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Quên mật khẩu?
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium uppercase tracking-wide text-foreground/70">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    disabled={isLoading}
                    className="bg-secondary/40 border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary placeholder:text-muted-foreground/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-10 font-medium"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Gửi link đặt lại mật khẩu
          </Button>
        </form>
      </Form>

      <Button
        variant="ghost"
        asChild
        className="w-full h-10 text-muted-foreground hover:text-foreground gap-2"
      >
        <Link href="/sign-in">
          <ArrowLeft className="size-4" />
          Quay lại đăng nhập
        </Link>
      </Button>
    </div>
  );
};

export default ForgotPasswordPage;
