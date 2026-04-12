"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleButton } from "@/components/common/google-button";
import { AuthDivider } from "@/components/common/auth-divider";
import { PasswordInput } from "@/components/common/password-input";
import { PasswordStrengthBar } from "@/components/common/password-strength-bar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const schema = z
  .object({
    fullName: z
      .string()
      .min(2, "Tên phải có ít nhất 2 ký tự")
      .max(100, "Tên quá dài"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .regex(/^(\+84|0)[0-9]{9}$/, "Số điện thoại không hợp lệ")
      .optional()
      .or(z.literal("")),
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

const inputCls =
  "bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary";
const labelCls =
  "text-xs font-medium uppercase tracking-wide text-muted-foreground";

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const watchedPassword = form.watch("password");

  const onSubmit = async (values: Values) => {
    await authClient.signUp.email(
      {
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        callbackURL: "/verify-email",
      },
      {
        onSuccess: () => router.push("/verify-email"),
        onError: (e) => {
          if (e.error.status === 429)
            toast.error(
              e.error.message || "Quá nhiều yêu cầu, vui lòng thử lại sau.",
            );
          else toast.error("Đăng ký thất bại. Email có thể đã được sử dụng.");
        },
      },
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tạo tài khoản mới
        </h1>
        <p className="text-sm text-muted-foreground">
          Đăng ký để bắt đầu trải nghiệm đặt phòng cao cấp
        </p>
      </div>

      <GoogleButton label="Đăng ký với Google" disabled={isLoading} />
      <AuthDivider label="hoặc đăng ký bằng email" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Họ và tên</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    disabled={isLoading}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 items-start gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelCls}>
                    Điện thoại{" "}
                    <span className="normal-case text-muted-foreground/60 font-normal">
                      (tuỳ chọn)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="0912 345 678"
                      autoComplete="tel"
                      disabled={isLoading}
                      className={inputCls}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelCls}>Mật khẩu</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
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
            Tạo tài khoản
          </Button>
        </form>
      </Form>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <Link
          href="/terms"
          className="text-foreground hover:text-foreground/80 underline underline-offset-2"
        >
          Điều khoản dịch vụ
        </Link>{" "}
        và{" "}
        <Link
          href="/privacy"
          className="text-foreground hover:text-foreground/80 underline underline-offset-2"
        >
          Chính sách bảo mật
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href="/sign-in"
          className="text-primary hover:text-primary/80 font-medium"
        >
          Đăng nhập
        </Link>
      </p>
    </motion.div>
  );
};

export default SignUpPage;
