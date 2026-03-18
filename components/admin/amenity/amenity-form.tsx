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

export const amenitySchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  icon: z.string().optional(),
});

export type AmenityFormValues = z.infer<typeof amenitySchema>;

interface AmenityFormProps {
  defaultValues?: AmenityFormValues;
  onSubmit: (data: AmenityFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export const AmenityForm = ({
  defaultValues = { name: "", icon: "" },
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: AmenityFormProps) => {
  const form = useForm<AmenityFormValues>({
    resolver: zodResolver(amenitySchema),
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
                Tên tiện nghi
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="WiFi, Bể bơi..."
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Icon (emoji)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="🏊"
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
