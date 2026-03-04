"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { AmenityMultiSelect } from "./amenity-multi-select";
import { useRoomTypeList } from "@/hooks/admin/use-admin-room-type";
import { RouterOutput } from "@/trpc/client";
import { useBedTypeList } from "@/hooks/admin/use-admin-bed-types";

export const roomFormSchema = z.object({
  name: z.string().min(2),
  roomTypeId: z.string().min(1, "Vui lòng chọn loại phòng"),
  description: z.string().min(10),
  capacity: z.number().min(1),
  sizeM2: z.number().optional(),
  floor: z.number().optional(),
  basePrice: z.number().min(0),
  isActive: z.boolean(),
  amenityIds: z.array(z.string()),
  beds: z
    .array(
      z.object({
        bedTypeId: z.string().min(1, "Vui lòng chọn loại giường"),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "Phải có ít nhất 1 loại giường"),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;

type RoomDetail = RouterOutput["admin"]["room"]["detail"];

export const DEFAULT_ROOM_FORM_VALUES: RoomFormValues = {
  name: "",
  roomTypeId: "",
  description: "",
  capacity: 2,
  sizeM2: undefined,
  floor: undefined,
  basePrice: 0,
  isActive: true,
  amenityIds: [],
  beds: [{ bedTypeId: "", quantity: 1 }],
};

export function roomDetailToFormValues(room: RoomDetail): RoomFormValues {
  return {
    name: room.name,
    roomTypeId: room.roomTypeId,
    description: room.description,
    capacity: room.capacity,
    sizeM2: room.sizeM2 ?? undefined,
    floor: room.floor ?? undefined,
    basePrice: Number(room.basePrice),
    isActive: room.isActive,
    amenityIds: room.amenities.map((a) => a.amenityId),
    beds: room.beds.map((b) => ({
      bedTypeId: b.bedType.id,
      quantity: b.quantity,
    })),
  };
}

interface RoomFormProps {
  defaultValues?: RoomFormValues;
  onSubmit: (data: RoomFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  isLoading?: boolean;
  submitLabel: string;
}

export const RoomForm = ({
  defaultValues = DEFAULT_ROOM_FORM_VALUES,
  onSubmit,
  onCancel,
  isPending,
  isLoading,
  submitLabel,
}: RoomFormProps) => {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "beds",
  });

  const { data: roomTypes = [] } = useRoomTypeList();
  const { data: bedTypes = [] } = useBedTypeList();

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Tên phòng</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Deluxe Ocean View..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Mô tả về phòng..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phòng</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roomTypes.map((rt) => (
                      <SelectItem key={rt.id} value={rt.id}>
                        {rt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sức chứa (khách)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá cơ bản (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="500000"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sizeM2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diện tích (m²)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    placeholder="25"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tầng</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="3"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="col-span-2 flex items-center justify-between rounded-lg border p-3">
                <FormLabel className="cursor-pointer">Hiển thị phòng</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel>Loại giường</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ bedTypeId: "", quantity: 1 })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Thêm giường
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name={`beds.${index}.bedTypeId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại giường" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bedTypes.map((bt) => (
                          <SelectItem key={bt.id} value={bt.id}>
                            {bt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`beds.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-destructive shrink-0"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="amenityIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiện nghi</FormLabel>
              <FormControl>
                <AmenityMultiSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
