import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { AmenityForm, AmenityFormValues } from "./amenity-form";
import {
  useCreateAmenity,
  useUpdateAmenity,
} from "@/hooks/admin/use-admin-amenities";

type Amenity = RouterOutput["admin"]["amenity"]["list"][number];

export const CreateAmenityForm = () => {
  const { closeModal } = useModalDialogStore();
  const createAmenity = useCreateAmenity();

  const onSubmit = async (data: AmenityFormValues) => {
    await createAmenity.mutateAsync({
      name: data.name,
      icon: data.icon || undefined,
    });
    closeModal();
  };

  return (
    <AmenityForm
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={createAmenity.isPending}
      submitLabel="Tạo"
    />
  );
};

interface EditAmenityFormProps {
  amenity: Amenity;
}

export const EditAmenityForm = ({ amenity }: EditAmenityFormProps) => {
  const { closeModal } = useModalDialogStore();
  const updateAmenity = useUpdateAmenity();

  const onSubmit = async (data: AmenityFormValues) => {
    await updateAmenity.mutateAsync({
      id: amenity.id,
      name: data.name,
      icon: data.icon || undefined,
    });
    closeModal();
  };

  return (
    <AmenityForm
      defaultValues={{ name: amenity.name, icon: amenity.icon ?? "" }}
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={updateAmenity.isPending}
      submitLabel="Lưu"
    />
  );
};
