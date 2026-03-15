"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const GuestInfoForm = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-foreground">
                Họ và tên
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Nguyễn Văn A"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guestPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium text-foreground">
                Số điện thoại
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+84 901 234 567"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
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
        name="guestEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium text-foreground">
              Email
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="example@email.com"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium text-foreground">
              Yêu cầu đặc biệt{" "}
              <span className="text-muted-foreground font-normal">
                (tuỳ chọn)
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Phòng tầng cao, không hút thuốc, đến muộn..."
                className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </div>
  );
};
