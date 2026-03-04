"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useMe, useUpdateProfile } from "@/hooks/client/use-user";
import { UploadButton } from "@/utils/uploadthing";

const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { data: user, isLoading } = useMe();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile.mutateAsync(data);
    form.reset(data);
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  if (isLoading) return <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.image ?? undefined} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>
        <UploadButton
          endpoint="profileImage"
          onClientUploadComplete={(res) => {
            if (res[0]) void updateProfile.mutateAsync({ image: res[0].ufsUrl });
          }}
          onUploadError={() => {}}
          appearance={{ button: "text-xs h-8 px-3" }}
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nguyễn Văn A" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="flex items-center gap-2">
              <Input value={user?.email ?? ""} readOnly className="bg-muted" />
              <Badge variant={user?.emailVerified ? "default" : "destructive"} className="shrink-0">
                {user?.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </Badge>
            </div>
          </FormItem>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+84..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={!form.formState.isDirty || updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu thay đổi
          </Button>
        </form>
      </Form>
    </div>
  );
};