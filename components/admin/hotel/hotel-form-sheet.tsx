import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import {
  HotelForm,
  HotelFormValues,
  hotelDetailToFormValues,
} from "./hotel-form";
import {
  useAdminHotelDetail,
  useCreateHotel,
  useUpdateHotel,
} from "@/hooks/admin/use-admin-hotels";

export const CreateHotelForm = () => {
  const { closeSheet } = useSheetDialogStore();
  const createHotel = useCreateHotel();

  const onSubmit = async (data: HotelFormValues) => {
    await createHotel.mutateAsync({
      name: data.name,
      description: data.description,
      starRating: data.starRating,
      status: data.status,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: {
        cityId: data.cityId,
        street: data.street,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      policy: {
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
      },
      amenityIds: data.amenityIds,
    });
    closeSheet();
  };

  return (
    <HotelForm
      onSubmit={onSubmit}
      onCancel={closeSheet}
      isPending={createHotel.isPending}
      submitLabel="Tạo khách sạn"
    />
  );
};

interface EditHotelFormProps {
  hotelId: string;
}

export const EditHotelForm = ({ hotelId }: EditHotelFormProps) => {
  const { closeSheet } = useSheetDialogStore();
  const { data: hotel, isLoading } = useAdminHotelDetail(hotelId);
  const updateHotel = useUpdateHotel(hotelId);

  const onSubmit = async (data: HotelFormValues) => {
    await updateHotel.mutateAsync({
      id: hotelId,
      name: data.name,
      description: data.description,
      starRating: data.starRating,
      status: data.status,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: {
        cityId: data.cityId,
        street: data.street,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      policy: {
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
      },
      amenityIds: data.amenityIds,
    });
    closeSheet();
  };

  return (
    <HotelForm
      defaultValues={hotel ? hotelDetailToFormValues(hotel) : undefined}
      onSubmit={onSubmit}
      onCancel={closeSheet}
      isPending={updateHotel.isPending}
      isLoading={isLoading}
      submitLabel="Lưu thay đổi"
    />
  );
};
