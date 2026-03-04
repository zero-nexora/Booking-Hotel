import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { RoomTypeForm, RoomTypeFormValues } from "./room-type-form";
import {
  useCreateRoomType,
  useUpdateRoomType,
} from "@/hooks/admin/use-admin-room-type";

type RoomType = RouterOutput["admin"]["roomType"]["list"][number];

export const CreateRoomTypeForm = () => {
  const { closeModal } = useModalDialogStore();
  const createRoomType = useCreateRoomType();

  const onSubmit = async (data: RoomTypeFormValues) => {
    await createRoomType.mutateAsync(data);
    closeModal();
  };

  return (
    <RoomTypeForm
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={createRoomType.isPending}
      submitLabel="Tạo"
    />
  );
};

interface EditRoomTypeFormProps {
  roomType: RoomType;
}

export const EditRoomTypeForm = ({ roomType }: EditRoomTypeFormProps) => {
  const { closeModal } = useModalDialogStore();
  const updateRoomType = useUpdateRoomType();

  const onSubmit = async (data: RoomTypeFormValues) => {
    await updateRoomType.mutateAsync({ id: roomType.id, ...data });
    closeModal();
  };

  return (
    <RoomTypeForm
      defaultValues={{ name: roomType.name }}
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={updateRoomType.isPending}
      submitLabel="Lưu"
    />
  );
};
