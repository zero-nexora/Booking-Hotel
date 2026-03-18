"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormActions } from "@/components/common/form-actions";

export const roomTypeSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(50),
});

export type RoomTypeFormValues = z.infer<typeof roomTypeSchema>;

interface RoomTypeFormProps {
  defaultValues?: RoomTypeFormValues;
  onSubmit: (data: RoomTypeFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export const RoomTypeForm = ({
  defaultValues = { name: "" },
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: RoomTypeFormProps) => {
  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Tên loại phòng
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Deluxe, Suite, Villa..."
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <FormActions
          onCancel={onCancel}
          isPending={isPending}
          submitLabel={submitLabel}
        />
      </form>
    </Form>
  );
};
