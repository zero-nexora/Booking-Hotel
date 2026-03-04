import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { CountryForm, CountryFormValues } from "./country-form";
import {
  useCreateCountry,
  useUpdateCountry,
} from "@/hooks/admin/use-admin-locations";

type Country = RouterOutput["admin"]["location"]["listCountries"][number];

export const CreateCountryForm = () => {
  const { closeModal } = useModalDialogStore();
  const createCountry = useCreateCountry();

  const onSubmit = async (data: CountryFormValues) => {
    await createCountry.mutateAsync(data);
    closeModal();
  };

  return (
    <CountryForm
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={createCountry.isPending}
      submitLabel="Tạo"
    />
  );
};

interface EditCountryFormProps {
  country: Country;
}

export const EditCountryForm = ({ country }: EditCountryFormProps) => {
  const { closeModal } = useModalDialogStore();
  const updateCountry = useUpdateCountry();

  const onSubmit = async (data: CountryFormValues) => {
    await updateCountry.mutateAsync({ id: country.id, ...data });
    closeModal();
  };

  return (
    <CountryForm
      defaultValues={{ name: country.name }}
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={updateCountry.isPending}
      submitLabel="Lưu"
    />
  );
};
