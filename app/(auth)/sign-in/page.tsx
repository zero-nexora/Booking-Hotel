"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleButton } from "@/components/common/google-button";
import { AuthDivider } from "@/components/common/auth-divider";
import { PasswordInput } from "@/components/common/password-input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
  rememberMe: z.boolean(),
});
type Values = z.infer<typeof schema>;

const SignInPage = () => {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: Values) => {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
        callbackURL: "/",
      });
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Chào mừng trở lại
        </h1>
        <p className="text-sm text-muted-foreground">
          Đăng nhập để tiếp tục trải nghiệm
        </p>
      </div>

      <GoogleButton label="Đăng nhập với Google" disabled={isLoading} />

      <AuthDivider />

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
                    disabled={isLoading}
                    className="bg-secondary/40 border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary placeholder:text-muted-foreground/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-medium uppercase tracking-wide text-foreground/70">
                    Mật khẩu
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="bg-secondary/40 border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary placeholder:text-muted-foreground/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2.5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <FormLabel className="text-sm text-muted-foreground font-normal cursor-pointer">
                  Ghi nhớ đăng nhập
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-10 font-medium"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            Đăng nhập
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link
          href="/sign-up"
          className="text-primary hover:text-primary/80 font-medium"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
