import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import { RoomForm, RoomFormValues, roomDetailToFormValues } from "./room-form";
import {
  useAdminRoomDetail,
  useCreateRoom,
  useUpdateRoom,
} from "@/hooks/admin/use-admin-rooms";

interface CreateRoomFormProps {
  hotelId: string;
}

export const CreateRoomForm = ({ hotelId }: CreateRoomFormProps) => {
  const { closeSheet } = useSheetDialogStore();
  const createRoom = useCreateRoom();

  const onSubmit = async (data: RoomFormValues) => {
    await createRoom.mutateAsync({
      hotelId,
      name: data.name,
      roomTypeId: data.roomTypeId,
      description: data.description,
      capacity: data.capacity,
      sizeM2: data.sizeM2,
      floor: data.floor,
      basePrice: data.basePrice,
      isActive: data.isActive,
      amenityIds: data.amenityIds,
      beds: data.beds,
    });
    closeSheet();
  };

  return (
    <RoomForm
      onSubmit={onSubmit}
      onCancel={closeSheet}
      isPending={createRoom.isPending}
      submitLabel="Tạo phòng"
    />
  );
};

interface EditRoomFormProps {
  roomId: string;
}

export const EditRoomForm = ({ roomId }: EditRoomFormProps) => {
  const { closeSheet } = useSheetDialogStore();
  const { data: room, isLoading } = useAdminRoomDetail(roomId);
  const updateRoom = useUpdateRoom();

  const onSubmit = async (data: RoomFormValues) => {
    await updateRoom.mutateAsync({
      id: roomId,
      name: data.name,
      roomTypeId: data.roomTypeId,
      description: data.description,
      capacity: data.capacity,
      sizeM2: data.sizeM2,
      floor: data.floor,
      basePrice: data.basePrice,
      isActive: data.isActive,
      amenityIds: data.amenityIds,
      beds: data.beds,
    });
    closeSheet();
  };

  return (
    <RoomForm
      defaultValues={room ? roomDetailToFormValues(room) : undefined}
      onSubmit={onSubmit}
      onCancel={closeSheet}
      isPending={updateRoom.isPending}
      isLoading={isLoading}
      submitLabel="Lưu thay đổi"
    />
  );
};
