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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import { adminRoomParsers } from "@/lib/search-params/admin-rooms";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { RouterOutput } from "@/trpc/client";
import { CreateRoomForm, EditRoomForm } from "./room-form-sheet";
import { useAdminRoomList, useDeleteRoom } from "@/hooks/admin/use-admin-rooms";
import { useRoomTypeList } from "@/hooks/admin/use-admin-room-type";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { DEFAULT_PAGE } from "@/lib/constants";

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

  const openCreate = () =>
    openSheet({
      title: "Thêm phòng",
      content: <CreateRoomForm hotelId={hotelId} />,
    });

  const openEdit = (room: Room) =>
    openSheet({
      title: `Chỉnh sửa "${room.name}"`,
      content: <EditRoomForm roomId={room.id} />,
    });

  const handleDelete = (room: Room) =>
    openConfirm({
      title: "Xóa phòng?",
      description: `Xóa "${room.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteRoom.mutateAsync({ id: room.id }),
    });

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
            onChange={(v) => setParams({ search: v, page: DEFAULT_PAGE })}
            placeholder="Tìm tên phòng..."
            className="w-56"
          />
          <Select
            value={params.roomTypeId || "all"}
            onValueChange={(v) =>
              setParams({ roomTypeId: v === "all" ? null : v, page: DEFAULT_PAGE })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Loại phòng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              {roomTypes.map((rt) => (
                <SelectItem key={rt.id} value={rt.id}>
                  {rt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.isActive === null ? "all" : String(params.isActive)}
            onValueChange={(v) =>
              setParams({
                isActive: v === "all" ? null : v === "true",
                page: DEFAULT_PAGE,
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Hoạt động</SelectItem>
              <SelectItem value="false">Ẩn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ListHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên phòng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Sức chứa</TableHead>
              <TableHead>Giá cơ bản</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Booking</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={7} />
          ) : (
            <TableBody>
              {data?.items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-12"
                  >
                    Chưa có phòng nào
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((room) => (
                  <RoomRow
                    key={room.id}
                    room={room}
                    onNavigate={() =>
                      router.push(
                        `/admin/hotels/${room.hotelId}/rooms/${room.id}`,
                      )
                    }
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </TableBody>
          )}
        </Table>
        {data && data.totalPages > 1 && (
          <Pagination
            page={params.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={params.limit}
            onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
            onLimitChange={(l) =>
              setParams((prev) => ({ ...prev, limit: l, page: 1 }))
            }
          />
        )}
      </Card>
    </div>
  );
};

interface RoomRowProps {
  room: Room;
  onNavigate: () => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const RoomRow = ({ room, onNavigate, onEdit, onDelete }: RoomRowProps) => (
  <TableRow className="cursor-pointer" onClick={onNavigate}>
    <TableCell>
      <div>
        <p className="font-medium text-sm">{room.name}</p>
        <p className="text-xs text-muted-foreground">{room.slug}</p>
      </div>
    </TableCell>
    <TableCell>
      <Badge variant="secondary">{room.roomType.name}</Badge>
    </TableCell>
    <TableCell className="text-sm">{room.capacity} khách</TableCell>
    <TableCell className="text-sm">
      ${Number(room.basePrice).toLocaleString("en-US")}
    </TableCell>
    <TableCell>
      <Badge variant={room.isActive ? "default" : "outline"}>
        {room.isActive ? "Hoạt động" : "Ẩn"}
      </Badge>
    </TableCell>
    <TableCell className="text-center text-sm">
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
          className="h-8 w-8"
          onClick={() => onEdit(room)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => onDelete(room)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
