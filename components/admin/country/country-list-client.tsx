"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { CreateCountryForm, EditCountryForm } from "./country-form-modal";
import {
  useCountryList,
  useDeleteCountry,
} from "@/hooks/admin/use-admin-locations";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { RowActions } from "@/components/shared/row-actions";

type Country = RouterOutput["admin"]["location"]["listCountries"][number];

export const CountryListClient = () => {
  const { data, isLoading } = useCountryList();
  const { openModal } = useModalDialogStore();
  const { openConfirm } = useConfirmDialogStore();
  const deleteCountry = useDeleteCountry();

  const openCreate = () =>
    openModal({
      title: "Thêm quốc gia",
      description: "Tạo mới quốc gia",
      content: <CreateCountryForm />,
    });

  const openEdit = (country: Country) =>
    openModal({
      title: "Chỉnh sửa quốc gia",
      description: `Cập nhật thông tin cho "${country.name}"`,
      content: <EditCountryForm country={country} />,
    });

  const handleDelete = (country: Country) =>
    openConfirm({
      title: "Xóa quốc gia?",
      description: `Xóa "${country.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteCountry.mutateAsync({ id: country.id }),
    });

  return (
    <div className="space-y-4">
      <ListHeader
        title="Quốc gia"
        count={data?.length}
        countLabel="quốc gia"
        addLabel="Thêm quốc gia"
        onAdd={openCreate}
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead className="text-center">Số thành phố</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={3} />
          ) : (
            <TableBody>
              {data?.map((country) => (
                <CountryRow
                  key={country.id}
                  country={country}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </Card>
    </div>
  );
};

interface CountryRowProps {
  country: Country;
  onEdit: (country: Country) => void;
  onDelete: (country: Country) => void;
}

const CountryRow = ({ country, onEdit, onDelete }: CountryRowProps) => (
  <TableRow>
    <TableCell className="font-medium">{country.name}</TableCell>
    <TableCell className="text-center text-sm">
      {country._count.cities}
    </TableCell>
    <TableCell>
      <RowActions
        onEdit={() => onEdit(country)}
        onDelete={() => onDelete(country)}
      />
    </TableCell>
  </TableRow>
);
