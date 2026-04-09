"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import {
  useAdminRoomDetail,
  useDeleteRoom,
} from "@/hooks/admin/use-admin-rooms";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { RoomImagesTab } from "./room-images-tab";
import { RoomAvailabilityTab } from "./room-availability-tab";
import { RouterOutput } from "@/trpc/client";
import { EditRoomForm } from "../hotel/room-form-sheet";
import { formatCurrencyUSD, formatDateShort } from "@/lib/utils";

type RoomDetail = RouterOutput["admin"]["room"]["detail"];

interface RoomDetailClientProps {
  roomId: string;
  hotelId: string;
}

const RoomDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-8 w-64" />
    </div>
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
    <Skeleton className="h-96" />
  </div>
);

interface RoomHeaderProps {
  room: RoomDetail;
  hotelId: string;
  onEdit: () => void;
  onDelete: () => void;
}

const RoomHeader = ({ room, hotelId, onEdit, onDelete }: RoomHeaderProps) => {
  const router = useRouter();
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/admin/hotels/${hotelId}`)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{room.name}</h1>
            <Badge variant="secondary">{room.roomType.name}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={room.isActive ? "default" : "outline"}>
              {room.isActive ? "Hoạt động" : "Ẩn"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {room.hotel.name}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-muted hover:text-foreground"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Xóa
        </Button>
      </div>
    </div>
  );
};

const RoomStats = ({ room }: { room: RoomDetail }) => (
  <div className="grid grid-cols-4 gap-4">
    <Card>
      <CardContent className="pt-2">
        <p className="text-sm text-muted-foreground">Sức chứa</p>
        <p className="text-3xl font-bold">{room.capacity}</p>
        <p className="text-xs text-muted-foreground mt-1">khách</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-2">
        <p className="text-sm text-muted-foreground">Giá cơ bản</p>
        <p className="text-2xl font-bold">
          {formatCurrencyUSD(Number(room.basePrice))}
        </p>
        <p className="text-xs text-muted-foreground mt-1">USD / đêm</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-2">
        <p className="text-sm text-muted-foreground">Diện tích</p>
        <p className="text-3xl font-bold">{room.sizeM2 ?? "—"}</p>
        {room.sizeM2 && (
          <p className="text-xs text-muted-foreground mt-1">m²</p>
        )}
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-2">
        <p className="text-sm text-muted-foreground">Tầng</p>
        <p className="text-3xl font-bold">{room.floor ?? "—"}</p>
      </CardContent>
    </Card>
  </div>
);

const RoomInfoTab = ({ room }: { room: RoomDetail }) => (
  <div className="grid grid-cols-2 gap-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Slug</span>
          <span className="font-mono">{room.slug}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Loại phòng</span>
          <Badge variant="secondary">{room.roomType.name}</Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Khách sạn</span>
          <span>{room.hotel.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ngày tạo</span>
          <span>{formatDateShort(room.createdAt)}</span>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Loại giường</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {room.beds.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có thông tin</p>
        ) : (
          room.beds.map((bed) => (
            <div key={bed.id} className="flex justify-between text-sm">
              <span>{bed.bedType.name}</span>
              <span className="text-muted-foreground">x{bed.quantity}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>

    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Tiện nghi</CardTitle>
      </CardHeader>
      <CardContent>
        {room.amenities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có tiện nghi</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {room.amenities.map(({ amenity }) => (
              <Badge key={amenity.id} variant="secondary">
                {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                {amenity.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    {room.description && (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Mô tả</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {room.description}
          </p>
        </CardContent>
      </Card>
    )}
  </div>
);

export const RoomDetailClient = ({
  roomId,
  hotelId,
}: RoomDetailClientProps) => {
  const router = useRouter();
  const { data: room, isLoading } = useAdminRoomDetail(roomId);
  const { openConfirm } = useConfirmDialogStore();
  const { openSheet } = useSheetDialogStore();
  const deleteRoom = useDeleteRoom();

  const openEdit = () => {
    openSheet({
      title: `Chỉnh sửa "${room?.name}"`,
      content: <EditRoomForm roomId={roomId} />,
    });
  };

  const handleDelete = () => {
    if (!room) return;
    openConfirm({
      title: "Xóa phòng?",
      description: `Xóa "${room.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () =>
        void deleteRoom.mutateAsync({ id: roomId }).then(() => {
          router.push(`/admin/hotels/${hotelId}`);
        }),
    });
  };

  if (isLoading) return <RoomDetailSkeleton />;
  if (!room) return null;

  return (
    <div className="space-y-6">
      <RoomHeader
        room={room}
        hotelId={hotelId}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <RoomStats room={room} />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="images">Ảnh ({room.images.length})</TabsTrigger>
          <TabsTrigger value="availability">Lịch phòng</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <RoomInfoTab room={room} />
        </TabsContent>
        <TabsContent value="images" className="mt-4">
          <RoomImagesTab roomId={roomId} images={room.images} />
        </TabsContent>
        <TabsContent value="availability" className="mt-4">
          <RoomAvailabilityTab roomId={roomId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
