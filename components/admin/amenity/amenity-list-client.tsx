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
import { CreateAmenityForm, EditAmenityForm } from "./amenity-form-modal";
import {
  useAmenityList,
  useDeleteAmenity,
} from "@/hooks/admin/use-admin-amenities";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { RowActions } from "@/components/shared/row-actions";

type Amenity = RouterOutput["admin"]["amenity"]["list"][number];

export const AmenityListClient = () => {
  const { data, isLoading } = useAmenityList();
  const { openModal } = useModalDialogStore();
  const { openConfirm } = useConfirmDialogStore();
  const deleteAmenity = useDeleteAmenity();

  const openCreate = () =>
    openModal({
      title: "Thêm tiện nghi",
      description: "Tạo mới tiện nghi cho khách sạn",
      content: <CreateAmenityForm />,
    });

  const openEdit = (amenity: Amenity) =>
    openModal({
      title: "Chỉnh sửa tiện nghi",
      description: `Cập nhật thông tin cho "${amenity.name}"`,
      content: <EditAmenityForm amenity={amenity} />,
    });

  const handleDelete = (amenity: Amenity) =>
    openConfirm({
      title: "Xóa tiện nghi?",
      description: `Xóa "${amenity.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteAmenity.mutateAsync({ id: amenity.id }),
    });

  return (
    <div className="space-y-4">
      <ListHeader
        title="Tiện nghi"
        count={data?.length}
        countLabel="tiện nghi"
        addLabel="Thêm tiện nghi"
        onAdd={openCreate}
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead className="text-center">Khách sạn dùng</TableHead>
              <TableHead className="text-center">Phòng dùng</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={5} />
          ) : (
            <TableBody>
              {data?.map((amenity) => (
                <AmenityRow
                  key={amenity.id}
                  amenity={amenity}
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

interface AmenityRowProps {
  amenity: Amenity;
  onEdit: (amenity: Amenity) => void;
  onDelete: (amenity: Amenity) => void;
}

const AmenityRow = ({ amenity, onEdit, onDelete }: AmenityRowProps) => (
  <TableRow>
    <TableCell>
      <span className="text-xl">{amenity.icon ?? "—"}</span>
    </TableCell>
    <TableCell className="font-medium">{amenity.name}</TableCell>
    <TableCell className="text-center text-sm">
      {amenity._count.hotels}
    </TableCell>
    <TableCell className="text-center text-sm">
      {amenity._count.rooms}
    </TableCell>
    <TableCell>
      <RowActions
        onEdit={() => onEdit(amenity)}
        onDelete={() => onDelete(amenity)}
      />
    </TableCell>
  </TableRow>
);
