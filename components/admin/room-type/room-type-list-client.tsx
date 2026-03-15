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
import { CreateRoomTypeForm, EditRoomTypeForm } from "./room-type-form-modal";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import {
  useDeleteRoomType,
  useRoomTypeList,
} from "@/hooks/admin/use-admin-room-type";
import { RowActions } from "@/components/shared/row-actions";

type RoomType = RouterOutput["admin"]["roomType"]["list"][number];

export const RoomTypeListClient = () => {
  const { data, isLoading } = useRoomTypeList();
  const { openModal } = useModalDialogStore();
  const { openConfirm } = useConfirmDialogStore();
  const deleteRoomType = useDeleteRoomType();

  const openCreate = () =>
    openModal({
      title: "Thêm loại phòng",
      description: "Tạo mới loại phòng",
      content: <CreateRoomTypeForm />,
    });

  const openEdit = (roomType: RoomType) =>
    openModal({
      title: "Chỉnh sửa loại phòng",
      description: `Cập nhật thông tin cho "${roomType.name}"`,
      content: <EditRoomTypeForm roomType={roomType} />,
    });

  const handleDelete = (roomType: RoomType) =>
    openConfirm({
      title: "Xóa loại phòng?",
      description: `Xóa "${roomType.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteRoomType.mutateAsync({ id: roomType.id }),
    });

  return (
    <div className="space-y-4">
      <ListHeader
        title="Loại phòng"
        count={data?.length}
        countLabel="loại phòng"
        addLabel="Thêm loại phòng"
        onAdd={openCreate}
      />
      <Card className="bg-card border-border shadow-none">
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
          {isLoading ? (
            <TableSkeleton cols={3} />
          ) : (
            <TableBody>
              {data?.map((roomType) => (
                <RoomTypeRow
                  key={roomType.id}
                  roomType={roomType}
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

interface RoomTypeRowProps {
  roomType: RoomType;
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomType: RoomType) => void;
}

const RoomTypeRow = ({ roomType, onEdit, onDelete }: RoomTypeRowProps) => (
  <TableRow className="border-border hover:bg-muted/40">
    <TableCell className="font-medium text-foreground">
      {roomType.name}
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {roomType._count.rooms}
    </TableCell>
    <TableCell>
      <RowActions
        onEdit={() => onEdit(roomType)}
        onDelete={() => onDelete(roomType)}
      />
    </TableCell>
  </TableRow>
);
