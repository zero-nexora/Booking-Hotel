"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import { adminRoomParsers } from "@/lib/search-params/admin-rooms";
import { SearchInput } from "@/components/common/search-input";
import { Pagination } from "@/components/common/pagination";
import { RouterOutput } from "@/trpc/client";
import { CreateRoomForm, EditRoomForm } from "./room-form-sheet";
import { useAdminRoomList, useDeleteRoom } from "@/hooks/admin/use-admin-rooms";
import { useRoomTypeList } from "@/hooks/admin/use-admin-room-type";
import { ListHeader } from "@/components/common/list-header";
import { DEFAULT_PAGE } from "@/lib/constants";
import { formatCurrencyUSD } from "@/lib/utils";
import { DataTableBody } from "@/components/common/table-body";

type Room = RouterOutput["admin"]["room"]["list"]["items"][number];

interface HotelRoomsTabProps {
  hotelId: string;
}

export const HotelRoomsTab = ({ hotelId }: HotelRoomsTabProps) => {
  const router = useRouter();
  const { openConfirm } = useConfirmDialogStore();
  const { openSheet } = useSheetDialogStore();

  const [params, setParams] = useQueryStates(adminRoomParsers);
  const { data, isLoading } = useAdminRoomList(hotelId, params);
  const { data: roomTypes = [] } = useRoomTypeList();
  const deleteRoom = useDeleteRoom();

  const openCreate = useCallback(
    () =>
      openSheet({
        title: "Thêm phòng",
        content: <CreateRoomForm hotelId={hotelId} />,
      }),
    [openSheet, hotelId],
  );

  const openEdit = useCallback(
    (room: Room) =>
      openSheet({
        title: `Chỉnh sửa "${room.name}"`,
        content: <EditRoomForm roomId={room.id} />,
      }),
    [openSheet],
  );

  const handleDelete = useCallback(
    (room: Room) =>
      openConfirm({
        title: "Xóa phòng?",
        description: `Xóa "${room.name}"? Hành động này không thể hoàn tác.`,
        variant: "destructive",
        onConfirm: () => void deleteRoom.mutateAsync({ id: room.id }),
      }),
    [openConfirm, deleteRoom],
  );

  const handleSearchChange = useCallback(
    (v: string) => setParams({ search: v, page: DEFAULT_PAGE }),
    [setParams],
  );

  const handleRoomTypeChange = useCallback(
    (v: string) =>
      setParams({ roomTypeId: v === "all" ? null : v, page: DEFAULT_PAGE }),
    [setParams],
  );

  const handleActiveChange = useCallback(
    (v: string) =>
      setParams({
        isActive: v === "all" ? null : v === "true",
        page: DEFAULT_PAGE,
      }),
    [setParams],
  );

  const handleNavigate = useCallback(
    (room: Room) =>
      router.push(`/admin/hotels/${room.hotelId}/rooms/${room.id}`),
    [router],
  );

  const handlePageChange = useCallback(
    (p: number) => setParams((prev) => ({ ...prev, page: p })),
    [setParams],
  );

  const handleLimitChange = useCallback(
    (l: number) => setParams((prev) => ({ ...prev, limit: l, page: 1 })),
    [setParams],
  );

  return (
    <div className="space-y-4">
      <ListHeader
        title="Phòng"
        count={data?.total}
        countLabel="phòng"
        addLabel="Thêm phòng"
        onAdd={openCreate}
      >
        <div className="flex flex-wrap gap-3">
          <SearchInput
            value={params.search}
            onChange={handleSearchChange}
            placeholder="Tìm tên phòng..."
            className="w-56"
          />
          <Select
            value={params.roomTypeId || "all"}
            onValueChange={handleRoomTypeChange}
          >
            <SelectTrigger className="w-44 border-border bg-background text-foreground">
              <SelectValue placeholder="Loại phòng" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả loại
              </SelectItem>
              {roomTypes.map((rt) => (
                <SelectItem
                  key={rt.id}
                  value={rt.id}
                  className="text-foreground hover:bg-muted"
                >
                  {rt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.isActive === null ? "all" : String(params.isActive)}
            onValueChange={handleActiveChange}
          >
            <SelectTrigger className="w-40 border-border bg-background text-foreground">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả
              </SelectItem>
              <SelectItem
                value="true"
                className="text-foreground hover:bg-muted"
              >
                Hoạt động
              </SelectItem>
              <SelectItem
                value="false"
                className="text-foreground hover:bg-muted"
              >
                Ẩn
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ListHeader>

      <Card className="bg-card border-border shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Tên phòng
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Loại
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Sức chứa
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Giá cơ bản
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Trạng thái
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Booking
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <DataTableBody
            data={data?.items}
            isLoading={isLoading}
            cols={7}
            emptyMessage="Chưa có phòng nào"
            renderRow={(room) => (
              <RoomRow
                key={room.id}
                room={room}
                onNavigate={handleNavigate}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          />
        </Table>
        {data && data.totalPages > 1 && (
          <Pagination
            page={params.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={params.limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </Card>
    </div>
  );
};

interface RoomRowProps {
  room: Room;
  onNavigate: (room: Room) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const RoomRow = ({ room, onNavigate, onEdit, onDelete }: RoomRowProps) => (
  <TableRow
    className="border-border hover:bg-muted/40 cursor-pointer"
    onClick={() => onNavigate(room)}
  >
    <TableCell>
      <div>
        <p className="font-medium text-sm text-foreground">{room.name}</p>
        <p className="text-xs text-muted-foreground">{room.slug}</p>
      </div>
    </TableCell>
    <TableCell>
      <Badge
        variant="outline"
        className="bg-muted text-muted-foreground border-border"
      >
        {room.roomType.name}
      </Badge>
    </TableCell>
    <TableCell className="text-sm text-foreground">
      {room.capacity} khách
    </TableCell>
    <TableCell className="text-sm text-foreground">
      {formatCurrencyUSD(Number(room.basePrice))}
    </TableCell>
    <TableCell>
      <Badge
        variant="outline"
        className={
          room.isActive
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-muted text-muted-foreground border-border"
        }
      >
        {room.isActive ? "Hoạt động" : "Ẩn"}
      </Badge>
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {room._count.bookingItems}
    </TableCell>
    <TableCell>
      <div
        className="flex justify-end gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={() => onEdit(room)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(room)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
