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

export function GuestInfoForm() {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="guestName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="guestPhone"
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

      <FormField
        control={form.control}
        name="guestEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium">Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="example@email.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-medium">
              Yêu cầu đặc biệt{" "}
              <span className="text-muted-foreground font-normal">
                (tuỳ chọn)
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Phòng tầng cao, không hút thuốc, đến muộn..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
