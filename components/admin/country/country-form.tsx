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
import { FormActions } from "@/components/shared/form-actions";

export const countrySchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
});

export type CountryFormValues = z.infer<typeof countrySchema>;

interface CountryFormProps {
  defaultValues?: CountryFormValues;
  onSubmit: (data: CountryFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export const CountryForm = ({
  defaultValues = { name: "" },
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: CountryFormProps) => {
  const form = useForm<CountryFormValues>({
    resolver: zodResolver(countrySchema),
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
              <FormLabel>Tên quốc gia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Việt Nam, Nhật Bản..." />
              </FormControl>
              <FormMessage />
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
