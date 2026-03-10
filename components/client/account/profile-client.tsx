"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  Shield,
  Link2,
  Link2Off,
  Trash2,
  Eye,
  EyeOff,
  Github,
  Chrome,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useMe,
  useUpdateProfile,
  useConnectedAccounts,
  useDeleteAccount,
} from "@/hooks/client/use-user";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";

const profileSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên"),
  phone: z.string().optional(),
  image: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

const PROVIDER_ICONS: Record<string, React.ElementType> = {
  github: Github,
  google: Chrome,
};

export function ProfileClient() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const { data: accounts } = useConnectedAccounts();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "", image: "" },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
        image: user.image ?? "",
      });
    }
  }, [user]);

  const handleProfileSubmit = async (values: ProfileValues) => {
    await updateProfile.mutateAsync(values);
  };

  const handlePasswordSubmit = async (values: PasswordValues) => {
    setChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });
      toast.success("Đổi mật khẩu thành công");
      passwordForm.reset();
    } catch {
      toast.error("Mật khẩu hiện tại không đúng");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount.mutateAsync({ confirm: true });
    router.push("/");
  };

  const handleResendVerification = async () => {
    try {
      await authClient.sendVerificationEmail({ email: user!.email });
      toast.success("Email xác minh đã được gửi lại");
    } catch {
      toast.error("Không thể gửi email. Thử lại sau.");
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (!user) return null;

  const avatarSrc = user.image ?? undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold">Hồ sơ</h1>

      {/* Avatar + profile form */}
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
          <div className="rounded-2xl border bg-card p-5 space-y-5">
            <p className="text-sm font-medium">Thông tin cá nhân</p>
            <Separator />

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative flex flex-col gap-4 items-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <UploadButton
                  endpoint="roomImages"
                  onClientUploadComplete={(res) => {
                    profileForm.setValue("image", res[0].ufsUrl);
                  }}
                  onUploadError={(err) => console.error("Upload error:", err)}
                  // className="h-16 w-32"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Họ và tên
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+84 901 234 567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email (readonly) */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Email</p>
              <div className="flex items-center gap-2">
                <Input
                  value={user.email}
                  readOnly
                  className="bg-muted/50 text-muted-foreground"
                />
                {user.emailVerified ? (
                  <div className="flex items-center gap-1.5 text-xs text-primary shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã xác minh
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 text-xs rounded-lg"
                    onClick={handleResendVerification}
                  >
                    Xác minh
                  </Button>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="sm"
              className="rounded-xl"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Change password */}
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
          <div className="rounded-2xl border bg-card p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Đổi mật khẩu</p>
            </div>
            <Separator />

            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">
                    Mật khẩu hiện tại
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      show={showCurrent}
                      onToggle={() => setShowCurrent((v) => !v)}
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        show={showNew}
                        onToggle={() => setShowNew((v) => !v)}
                        placeholder="Tối thiểu 8 ký tự"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      Xác nhận mật khẩu
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        show={showConfirm}
                        onToggle={() => setShowConfirm((v) => !v)}
                        placeholder="Nhập lại mật khẩu mới"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="sm"
              className="rounded-xl"
              disabled={changingPassword}
            >
              {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Connected accounts */}
      {accounts && accounts.length > 0 && (
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium">Tài khoản liên kết</p>
          </div>
          <Separator />
          <div className="space-y-2">
            {accounts.map((acc) => {
              const Icon =
                PROVIDER_ICONS[acc.providerId.toLowerCase()] ?? Link2;
              return (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium capitalize">
                      {acc.providerId}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Đã kết nối
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Link2Off className="w-3 h-3" />
                    Ngắt kết nối
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danger zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
        <p className="text-sm font-medium text-destructive">Vùng nguy hiểm</p>
        <Separator className="border-destructive/20" />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-medium">Xoá tài khoản</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tất cả dữ liệu sẽ bị xoá vĩnh viễn và không thể khôi phục.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Xoá tài khoản
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn chắc chắn muốn xoá?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Tài khoản, đặt phòng và đánh
                  giá của bạn sẽ bị xoá vĩnh viễn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Huỷ</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={handleDeleteAccount}
                >
                  Xoá vĩnh viễn
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  show,
  onToggle,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} className="pr-9" {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground center-box"
      >
        {show ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-52 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  );
}
