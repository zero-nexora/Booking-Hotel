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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RouterOutput } from "@/trpc/client";
import { FormActions } from "@/components/shared/form-actions";

export const citySchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  countryId: z.string().min(1, "Vui lòng chọn quốc gia"),
});

export type CityFormValues = z.infer<typeof citySchema>;

type Country = RouterOutput["admin"]["location"]["listCountries"][number];

interface CityFormProps {
  defaultValues?: CityFormValues;
  onSubmit: (data: CityFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  countries: Country[];
}

export const CityForm = ({
  defaultValues = { name: "", countryId: "" },
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
  countries,
}: CityFormProps) => {
  const form = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
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
              <FormLabel>Tên thành phố</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Hà Nội, Tokyo..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quốc gia</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quốc gia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
