import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { CityForm, CityFormValues } from "./city-form";
import { useCreateCity, useUpdateCity } from "@/hooks/admin/use-admin-locations";

type Country = RouterOutput["admin"]["location"]["listCountries"][number];
type City = RouterOutput["admin"]["location"]["listCities"][number];

interface CreateCityFormProps {
  countries: Country[];
  defaultCountryId?: string;
}

export const CreateCityForm = ({
  countries,
  defaultCountryId,
}: CreateCityFormProps) => {
  const { closeModal } = useModalDialogStore();
  const createCity = useCreateCity();

  const onSubmit = async (data: CityFormValues) => {
    await createCity.mutateAsync(data);
    closeModal();
  };

  return (
    <CityForm
      defaultValues={{ name: "", countryId: defaultCountryId ?? "" }}
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={createCity.isPending}
      submitLabel="Tạo"
      countries={countries}
    />
  );
};

interface EditCityFormProps {
  city: City;
  countries: Country[];
}

export const EditCityForm = ({ city, countries }: EditCityFormProps) => {
  const { closeModal } = useModalDialogStore();
  const updateCity = useUpdateCity();

  const onSubmit = async (data: CityFormValues) => {
    await updateCity.mutateAsync({ id: city.id, ...data });
    closeModal();
  };

  return (
    <CityForm
      defaultValues={{ name: city.name, countryId: city.countryId }}
      onSubmit={onSubmit}
      onCancel={closeModal}
      isPending={updateCity.isPending}
      submitLabel="Lưu"
      countries={countries}
    />
  );
};
