"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { AmenityMultiSelect } from "./amenity-multi-select";
import { RouterOutput } from "@/trpc/client";
import { useCityList, useCountryList } from "@/hooks/admin/use-admin-locations";
import { FormActions } from "@/components/common/form-actions";
import { MapPicker } from "@/components/common/map-picker";

export const hotelFormSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Tên khách sạn không được để trống"
          : "Tên khách sạn phải là chuỗi",
    })
    .min(2, { error: "Tên khách sạn phải có ít nhất 2 ký tự" }),

  description: z
    .string({
      error: "Mô tả không hợp lệ",
    })
    .min(10, { error: "Mô tả phải có ít nhất 10 ký tự" }),

  starRating: z
    .number({
      error: "Số sao phải là số",
    })
    .min(1, { error: "Số sao tối thiểu là 1" })
    .max(5, { error: "Số sao tối đa là 5" })
    .int({ error: "Số sao phải là số nguyên" }),

  status: z.enum(["ACTIVE", "INACTIVE", "MAINTENANCE"], {
    error: "Trạng thái không hợp lệ",
  }),

  phone: z.string().optional(),

  email: z
    .string()
    .email({ error: "Email không hợp lệ" })
    .optional()
    .or(z.literal("")),

  checkInTime: z.string({
    error: "Vui lòng nhập giờ check-in",
  }),

  checkOutTime: z.string({
    error: "Vui lòng nhập giờ check-out",
  }),

  street: z
    .string({
      error: "Địa chỉ không hợp lệ",
    })
    .min(2, { error: "Địa chỉ phải có ít nhất 2 ký tự" }),

  countryId: z.string().min(1, { error: "Vui lòng chọn quốc gia" }),

  cityId: z.string().min(1, { error: "Vui lòng chọn thành phố" }),

  latitude: z
    .number({
      error: "Vĩ độ phải là số",
    })
    .optional(),

  longitude: z
    .number({
      error: "Kinh độ phải là số",
    })
    .optional(),

  amenityIds: z
    .array(z.string(), {
      error: "Vui lòng chọn tiện nghi",
    })
    .min(1, { error: "Phải chọn ít nhất 1 tiện nghi" }),
});

export type HotelFormValues = z.infer<typeof hotelFormSchema>;

type HotelDetail = RouterOutput["admin"]["hotel"]["detail"];

export const DEFAULT_HOTEL_FORM_VALUES: HotelFormValues = {
  name: "",
  description: "",
  starRating: 3,
  status: "ACTIVE",
  phone: "",
  email: "",
  checkInTime: "14:00",
  checkOutTime: "12:00",
  street: "",
  countryId: "",
  cityId: "",
  amenityIds: [],
};

export const hotelDetailToFormValues = (
  hotel: HotelDetail,
): HotelFormValues => ({
  name: hotel.name,
  description: hotel.description,
  starRating: hotel.starRating,
  status: hotel.status,
  phone: hotel.phone ?? "",
  email: hotel.email ?? "",
  checkInTime: hotel.policy?.checkInTime ?? "14:00",
  checkOutTime: hotel.policy?.checkOutTime ?? "12:00",
  street: hotel.address.street,
  countryId: hotel.address.city.countryId,
  cityId: hotel.address.cityId,
  latitude: hotel.address.latitude ?? undefined,
  longitude: hotel.address.longitude ?? undefined,
  amenityIds: hotel.amenities.map((a) => a.amenityId),
});

interface ComboboxFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
}

const ComboboxField = ({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled,
}: ComboboxFieldProps) => {
  const selected = options.find((o) => o.id === value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="w-full justify-between font-normal border-border bg-background text-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          {selected ? (
            selected.name
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-card border-border"
        align="start"
      >
        <Command className="bg-card">
          <CommandInput
            placeholder={searchPlaceholder}
            className="text-foreground placeholder:text-muted-foreground"
          />
          <CommandList>
            <CommandEmpty className="text-muted-foreground text-sm py-4 text-center">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => onChange(option.id)}
                  className="text-foreground hover:bg-muted cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      value === option.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface HotelFormProps {
  defaultValues?: HotelFormValues;
  onSubmit: (data: HotelFormValues) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  isLoading?: boolean;
  submitLabel: string;
}

export const HotelForm = ({
  defaultValues = DEFAULT_HOTEL_FORM_VALUES,
  onSubmit,
  onCancel,
  isPending,
  isLoading,
  submitLabel,
}: HotelFormProps) => {
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const selectedCountryId = useWatch({
    control: form.control,
    name: "countryId",
  });
  const watchedLat = useWatch({ control: form.control, name: "latitude" });
  const watchedLng = useWatch({ control: form.control, name: "longitude" });

  const { data: countries = [] } = useCountryList();
  const { data: cities = [] } = useCityList(selectedCountryId || undefined);

  const handleCountryChange = (countryId: string) => {
    form.setValue("countryId", countryId);
    form.setValue("cityId", "");
  };

  const handleMapClick = (lat: number, lng: number) => {
    form.setValue("latitude", parseFloat(lat.toFixed(6)));
    form.setValue("longitude", parseFloat(lng.toFixed(6)));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full bg-muted" />
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
                <FormLabel className="text-foreground font-medium">
                  Tên khách sạn
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Grand Palace Hotel"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-foreground font-medium">
                  Mô tả
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={3}
                    placeholder="Mô tả về khách sạn..."
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary resize-none"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="starRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Hạng sao
                </FormLabel>
                <Select
                  value={String(field.value)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-border">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <SelectItem
                        key={s}
                        value={String(s)}
                        className="text-foreground hover:bg-muted"
                      >
                        {s} sao
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Trạng thái
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-border">
                    <SelectItem
                      value="ACTIVE"
                      className="text-foreground hover:bg-muted"
                    >
                      Hoạt động
                    </SelectItem>
                    <SelectItem
                      value="INACTIVE"
                      className="text-foreground hover:bg-muted"
                    >
                      Không hoạt động
                    </SelectItem>
                    <SelectItem
                      value="MAINTENANCE"
                      className="text-foreground hover:bg-muted"
                    >
                      Bảo trì
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Điện thoại
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+84..."
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="hotel@example.com"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Giờ check-in
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="time"
                    className="bg-background border-border text-foreground focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkOutTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-medium">
                  Giờ check-out
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="time"
                    className="bg-background border-border text-foreground focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-foreground font-medium">
                  Địa chỉ
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123 Đường ABC..."
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          <div className="col-span-2 grid grid-cols-2 items-start gap-3">
            <FormField
              control={form.control}
              name="countryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Quốc gia
                  </FormLabel>
                  <FormControl>
                    <ComboboxField
                      value={field.value}
                      onChange={handleCountryChange}
                      options={countries}
                      placeholder="Chọn quốc gia"
                      searchPlaceholder="Tìm quốc gia..."
                      emptyText="Không tìm thấy quốc gia"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    Thành phố
                  </FormLabel>
                  <FormControl>
                    <ComboboxField
                      value={field.value}
                      onChange={field.onChange}
                      options={cities}
                      placeholder="Chọn thành phố"
                      searchPlaceholder="Tìm thành phố..."
                      emptyText={
                        selectedCountryId
                          ? "Không tìm thấy thành phố"
                          : "Chọn quốc gia trước"
                      }
                      disabled={!selectedCountryId}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Vị trí trên bản đồ
              </span>
            </div>
            {watchedLat && watchedLng && (
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">
                {watchedLat.toFixed(5)}, {watchedLng.toFixed(5)}
              </span>
            )}
          </div>

          <MapPicker
            lat={watchedLat}
            lng={watchedLng}
            onChange={handleMapClick}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Vĩ độ (Latitude)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="21.027800"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-muted-foreground">
                    Kinh độ (Longitude)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="105.834200"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="amenityIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-medium">
                Tiện nghi
              </FormLabel>
              <FormControl>
                <AmenityMultiSelect
                  value={field.value}
                  onChange={field.onChange}
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
          fullWidth
        />
      </form>
    </Form>
  );
};
