import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { BedTypeForm, BedTypeFormValues } from "./bed-type-form";
import {
  useCreateBedType,
  useUpdateBedType,
} from "@/hooks/admin/use-admin-bed-types";

type BedType = RouterOutput["admin"]["bedType"]["list"][number];

export const CreateBedTypeForm = () => {
  const { closeModal } = useModalDialogStore();
  const createBedType = useCreateBedType();

  const onSubmit = async (data: BedTypeFormValues) => {
    await createBedType.mutateAsync(data);
    closeModal();
  };

  return (
    <BedTypeForm
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={createBedType.isPending}
      submitLabel="Tạo"
    />
  );
};

interface EditBedTypeFormProps {
  bedType: BedType;
}

export const EditBedTypeForm = ({ bedType }: EditBedTypeFormProps) => {
  const { closeModal } = useModalDialogStore();
  const updateBedType = useUpdateBedType();

  const onSubmit = async (data: BedTypeFormValues) => {
    await updateBedType.mutateAsync({ id: bedType.id, ...data });
    closeModal();
  };

  return (
    <BedTypeForm
      defaultValues={{ name: bedType.name }}
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={updateBedType.isPending}
      submitLabel="Lưu"
    />
  );
};
