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
  Github,
  Chrome,
  Pencil,
  X,
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
  useMe,
  useUpdateProfile,
  useConnectedAccounts,
  useDeleteAccount,
} from "@/hooks/client/use-user";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";
import { Card } from "@/components/ui/card";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { PasswordInput } from "@/components/common/password-input";
import { PasswordStrengthBar } from "@/components/common/password-strength-bar";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

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

const expandVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: "hidden" as const,
  },
  visible: {
    opacity: 1,
    height: "auto",
    overflow: "hidden" as const,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden" as const,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const ProfileClient = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { openConfirm } = useConfirmDialogStore();

  const { data: user, isLoading } = useMe();
  const { data: accounts } = useConnectedAccounts();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
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
  }, [user, profileForm]);

  const handleProfileSubmit = async (values: ProfileValues) => {
    await updateProfile.mutateAsync(values);
    setIsEditingProfile(false);
  };

  const handleCancelProfile = () => {
    profileForm.reset({
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      image: user?.image ?? "",
    });
    setIsEditingProfile(false);
  };

  const handleCancelPassword = () => {
    passwordForm.reset();
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setIsEditingPassword(false);
  };

  const handleUnLinkAccount = async (providerId: string, accountId: string) => {
    await authClient.unlinkAccount({ providerId, accountId });
    router.refresh();
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.removeQueries({ queryKey: trpc.client.user.me.queryKey() });
    router.push("/");
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
      handleCancelPassword();
      setTimeout(() => {
        handleSignOut();
      }, 2000);
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

  const handleOpenDeleteAccountDialog = () =>
    openConfirm({
      title: "Bạn chắc chắn muốn xoá?",
      description:
        "Hành động này không thể hoàn tác. Tài khoản, đặt phòng và đánh giá của bạn sẽ bị xoá vĩnh viễn",
      variant: "destructive",
      onConfirm: handleDeleteAccount,
    });

  const handleOpenUnLinkDialog = (providerId: string, accountId: string) =>
    openConfirm({
      title: `Ngắt kết nối ${providerId}?`,
      description: `Bạn có chắc chắn muốn ngắt kết nối tài khoản ${providerId}?`,
      variant: "destructive",
      onConfirm: () => handleUnLinkAccount(providerId, accountId),
    });

  if (isLoading) return <ProfileSkeleton />;
  if (!user) return null;

  const avatarSrc = user.image ?? undefined;
  const hasCredentialAccount =
    accounts?.some((acc) => acc.providerId === "credential") ?? false;

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Hồ sơ</h1>

      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
          <Card className="rounded-2xl border border-border bg-card shadow-none p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Thông tin cá nhân
              </p>
              {!isEditingProfile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Pencil className="w-3 h-3" />
                  Chỉnh sửa
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={handleCancelProfile}
                >
                  <X className="w-3 h-3" />
                  Huỷ
                </Button>
              )}
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center gap-4">
              <div className="relative flex flex-col gap-4 items-center">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  {isEditingProfile && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <UploadButton
                        endpoint="profileImage"
                        onClientUploadComplete={(res) => {
                          profileForm.setValue("image", res[0].ufsUrl);
                        }}
                        onUploadError={(err) =>
                          console.error("Upload error:", err)
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <AnimatePresence>
              {isEditingProfile && (
                <motion.div
                  variants={expandVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-foreground">
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-foreground">
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+84 901 234 567"
                              {...field}
                              className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl w-fit bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {!isEditingProfile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="bg-background border-border text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-foreground">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+84 901 234 567"
                          {...field}
                          disabled
                          className="bg-background border-border text-foreground disabled:bg-muted/40 disabled:text-muted-foreground"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Input
                  value={user.email}
                  readOnly
                  className="bg-muted/40 text-muted-foreground border-border"
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
                    className="shrink-0 text-xs rounded-lg border-border text-foreground hover:bg-muted"
                    onClick={handleResendVerification}
                  >
                    Xác minh
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </form>
      </Form>

      {hasCredentialAccount && (
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
            <Card className="rounded-2xl border border-border bg-card shadow-none p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">
                    Đổi mật khẩu
                  </p>
                </div>
                {!isEditingPassword ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => setIsEditingPassword(true)}
                  >
                    <Pencil className="w-3 h-3" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={handleCancelPassword}
                  >
                    <X className="w-3 h-3" />
                    Huỷ
                  </Button>
                )}
              </div>
              <Separator className="bg-border" />

              <AnimatePresence mode="wait">
                {isEditingPassword ? (
                  <motion.div
                    key="editing"
                    variants={expandVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-foreground">
                            Mật khẩu hiện tại
                          </FormLabel>
                          <PasswordInput
                            show={showCurrent}
                            onToggle={() => setShowCurrent((v) => !v)}
                            {...field}
                          />
                          <FormMessage className="text-destructive" />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-foreground">
                              Mật khẩu mới
                            </FormLabel>
                            <PasswordInput
                              show={showNew}
                              onToggle={() => setShowNew((v) => !v)}
                              {...field}
                            />
                            <PasswordStrengthBar password={field.value} />
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-foreground">
                              Xác nhận mật khẩu
                            </FormLabel>
                            <PasswordInput
                              show={showConfirm}
                              onToggle={() => setShowConfirm((v) => !v)}
                              placeholder="Nhập lại mật khẩu mới"
                              {...field}
                            />
                            <FormMessage className="text-destructive" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={changingPassword}
                    >
                      {changingPassword ? "Đang đổi..." : "Đổi mật khẩu"}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.p
                    key="static"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-muted-foreground"
                  >
                    Nhấn chỉnh sửa để thay đổi mật khẩu của bạn.
                  </motion.p>
                )}
              </AnimatePresence>
            </Card>
          </form>
        </Form>
      )}

      {accounts && accounts.length > 0 && (
        <Card className="rounded-2xl border border-border bg-card shadow-none p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Tài khoản liên kết
            </p>
          </div>
          <Separator className="bg-border" />
          <div className="space-y-2">
            {accounts.map((acc) => {
              const Icon =
                PROVIDER_ICONS[acc.providerId.toLowerCase()] ?? Link2;
              return (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground capitalize">
                      {acc.providerId}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      Đã kết nối
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() =>
                      handleOpenUnLinkDialog(acc.providerId, acc.id)
                    }
                  >
                    <Link2Off className="w-3 h-3" />
                    Ngắt kết nối
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
        <p className="text-sm font-medium text-destructive">Vùng nguy hiểm</p>
        <Separator className="bg-destructive/20" />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-medium text-foreground">Xoá tài khoản</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tất cả dữ liệu sẽ bị xoá vĩnh viễn và không thể khôi phục.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="rounded-xl gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleOpenDeleteAccountDialog}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Xoá tài khoản
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-5">
    <Skeleton className="h-7 w-24 bg-muted" />
    <Skeleton className="h-56 rounded-2xl bg-muted" />
    <Skeleton className="h-52 rounded-2xl bg-muted" />
    <Skeleton className="h-32 rounded-2xl bg-muted" />
  </div>
);
