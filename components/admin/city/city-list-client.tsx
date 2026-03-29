"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useModalDialogStore } from "@/store/modal-dialog-store";
import { RouterOutput } from "@/trpc/client";
import { CreateCityForm, EditCityForm } from "./city-form-modal";
import {
  useCityList,
  useCountryList,
  useDeleteCity,
} from "@/hooks/admin/use-admin-locations";
import { ListHeader } from "@/components/common/list-header";
import { RowActions } from "@/components/common/row-actions";
import { DataTableBody } from "@/components/common/table-body";

type City = RouterOutput["admin"]["location"]["listCities"][number];

export const CityListClient = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<
    string | undefined
  >();

  const { data: countries = [] } = useCountryList();
  const { data: cities, isLoading } = useCityList(selectedCountryId);
  const { openModal } = useModalDialogStore();
  const { openConfirm } = useConfirmDialogStore();
  const deleteCity = useDeleteCity();

  const openCreate = () =>
    openModal({
      title: "Thêm thành phố",
      description: "Tạo mới thành phố",
      content: (
        <CreateCityForm
          countries={countries}
          defaultCountryId={selectedCountryId}
        />
      ),
    });

  const openEdit = (city: City) =>
    openModal({
      title: "Chỉnh sửa thành phố",
      description: `Cập nhật thông tin cho "${city.name}"`,
      content: <EditCityForm city={city} countries={countries} />,
    });

  const handleDelete = (city: City) =>
    openConfirm({
      title: "Xóa thành phố?",
      description: `Xóa "${city.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteCity.mutateAsync({ id: city.id }),
    });

  return (
    <div className="space-y-4">
      <ListHeader
        title="Thành phố"
        count={cities?.length}
        countLabel="thành phố"
        addLabel="Thêm thành phố"
        onAdd={openCreate}
      >
        <Select
          value={selectedCountryId ?? "all"}
          onValueChange={(v) =>
            setSelectedCountryId(v === "all" ? undefined : v)
          }
        >
          <SelectTrigger className="w-48 border-border bg-background text-foreground">
            <SelectValue placeholder="Tất cả quốc gia" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground hover:bg-muted">
              Tất cả quốc gia
            </SelectItem>
            {countries.map((c) => (
              <SelectItem
                key={c.id}
                value={c.id}
                className="text-foreground hover:bg-muted"
              >
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ListHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Tên
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Quốc gia
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Khách sạn
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <DataTableBody
            data={cities}
            isLoading={isLoading}
            cols={4}
            emptyMessage="Không tìm thấy thành phố nào"
            renderRow={(city) => (
              <CityRow
                key={city.id}
                city={city}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          />
        </Table>
      </Card>
    </div>
  );
};

interface CityRowProps {
  city: City;
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
}

const CityRow = ({ city, onEdit, onDelete }: CityRowProps) => (
  <TableRow className="border-border hover:bg-muted/40">
    <TableCell className="font-medium text-foreground">{city.name}</TableCell>
    <TableCell>
      <Badge
        variant="outline"
        className="bg-muted text-muted-foreground border-border font-medium text-xs"
      >
        {city.country.name}
      </Badge>
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {city._count.addresses}
    </TableCell>
    <TableCell>
      <RowActions onEdit={() => onEdit(city)} onDelete={() => onDelete(city)} />
    </TableCell>
  </TableRow>
);
