"use client";

import { Card } from "@/components/ui/card";
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
import { CreateBedTypeForm, EditBedTypeForm } from "./bed-type-form-modal";
import {
  useBedTypeList,
  useDeleteBedType,
} from "@/hooks/admin/use-admin-bed-types";
import { ListHeader } from "@/components/common/list-header";
import { RowActions } from "@/components/common/row-actions";
import { DataTableBody } from "@/components/common/table-body";

type BedType = RouterOutput["admin"]["bedType"]["list"][number];

export const BedTypeListClient = () => {
  const { data, isLoading } = useBedTypeList();
  const { openModal } = useModalDialogStore();
  const { openConfirm } = useConfirmDialogStore();
  const deleteBedType = useDeleteBedType();

  const openCreate = () =>
    openModal({
      title: "Thêm loại giường",
      description: "Tạo mới loại giường",
      content: <CreateBedTypeForm />,
    });

  const openEdit = (bedType: BedType) =>
    openModal({
      title: "Chỉnh sửa loại giường",
      description: `Cập nhật thông tin cho "${bedType.name}"`,
      content: <EditBedTypeForm bedType={bedType} />,
    });

  const handleDelete = (bedType: BedType) =>
    openConfirm({
      title: "Xóa loại giường?",
      description: `Xóa "${bedType.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteBedType.mutateAsync({ id: bedType.id }),
    });

  return (
    <div className="space-y-4">
      <ListHeader
        title="Loại giường"
        count={data?.length}
        countLabel="loại giường"
        addLabel="Thêm loại giường"
        onAdd={openCreate}
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Tên
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Phòng dùng
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <DataTableBody
            data={data}
            isLoading={isLoading}
            cols={3}
            emptyMessage="Không tìm thấy loại giường nào"
            renderRow={(bedType) => (
              <BedTypeRow
                key={bedType.id}
                bedType={bedType}
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

interface BedTypeRowProps {
  bedType: BedType;
  onEdit: (bedType: BedType) => void;
  onDelete: (bedType: BedType) => void;
}

const BedTypeRow = ({ bedType, onEdit, onDelete }: BedTypeRowProps) => (
  <TableRow className="border-border hover:bg-muted/40">
    <TableCell className="font-medium text-foreground">
      {bedType.name}
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {bedType._count.roomBeds}
    </TableCell>
    <TableCell>
      <RowActions
        onEdit={() => onEdit(bedType)}
        onDelete={() => onDelete(bedType)}
      />
    </TableCell>
  </TableRow>
);
