"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import { ArrowLeft, Star, Pencil, Trash2 } from "lucide-react";
import { RouterOutput } from "@/trpc/client";
import { EditHotelForm } from "./hotel-form-sheet";
import { HotelImagesTab } from "./hotel-images-tab";
import { HotelRoomsTab } from "./hotel-rooms-tab";
import { HotelBookingsTab } from "./hotel-bookings-tab";
import { HotelReviewsTab } from "./hotel-reviews-tab";
import { useAdminHotelDetail, useDeleteHotel } from "@/hooks/admin/use-admin-hotels";

type HotelDetail = RouterOutput["admin"]["hotel"]["detail"];

interface HotelDetailClientProps {
  hotelId: string;
}

const HotelDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-8 w-64" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
    <Skeleton className="h-96" />
  </div>
);

interface HotelHeaderProps {
  hotel: HotelDetail;
  onEdit: () => void;
  onDelete: () => void;
}

const HotelHeader = ({ hotel, onEdit, onDelete }: HotelHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/admin/hotels")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{hotel.name}</h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{hotel.starRating}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={hotel.status} type="hotel" />
            <span className="text-sm text-muted-foreground">
              {hotel.address.city.name}, {hotel.address.city.country.name}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
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

interface HotelStatsProps {
  hotel: HotelDetail;
}

const HotelStats = ({ hotel }: HotelStatsProps) => (
  <div className="grid grid-cols-3 gap-4">
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Phòng</p>
        <p className="text-3xl font-bold">{hotel._count.rooms}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Booking</p>
        <p className="text-3xl font-bold">{hotel._count.bookings}</p>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Đánh giá</p>
        <p className="text-3xl font-bold">{hotel._count.reviews}</p>
      </CardContent>
    </Card>
  </div>
);

interface HotelInfoTabProps {
  hotel: HotelDetail;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span>{value}</span>
  </div>
);

const HotelInfoTab = ({ hotel }: HotelInfoTabProps) => (
  <div className="grid grid-cols-2 gap-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <InfoRow label="Slug" value={<span className="font-mono">{hotel.slug}</span>} />
        <InfoRow label="Điện thoại" value={hotel.phone ?? "—"} />
        <InfoRow label="Email" value={hotel.email ?? "—"} />
        <InfoRow
          label="Ngày tạo"
          value={format(new Date(hotel.createdAt), "dd/MM/yyyy")}
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Địa chỉ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <InfoRow label="Đường" value={hotel.address.street} />
        {hotel.address.state && (
          <InfoRow label="Tỉnh/Bang" value={hotel.address.state} />
        )}
        <InfoRow label="Thành phố" value={hotel.address.city.name} />
        <InfoRow label="Quốc gia" value={hotel.address.city.country.name} />
        {hotel.address.latitude && hotel.address.longitude && (
          <InfoRow
            label="Tọa độ"
            value={
              <span className="font-mono text-xs">
                {hotel.address.latitude.toFixed(4)},{" "}
                {hotel.address.longitude.toFixed(4)}
              </span>
            }
          />
        )}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Chính sách</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <InfoRow label="Check-in" value={hotel.policy?.checkInTime ?? "14:00"} />
        <InfoRow label="Check-out" value={hotel.policy?.checkOutTime ?? "12:00"} />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tiện nghi</CardTitle>
      </CardHeader>
      <CardContent>
        {hotel.amenities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có tiện nghi</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.map(({ amenity }) => (
              <Badge key={amenity.id} variant="secondary">
                {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                {amenity.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    {hotel.description && (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Mô tả</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {hotel.description}
          </p>
        </CardContent>
      </Card>
    )}
  </div>
);

export const HotelDetailClient = ({ hotelId }: HotelDetailClientProps) => {
  const { data: hotel, isLoading } = useAdminHotelDetail(hotelId);
  const { openConfirm } = useConfirmDialogStore();
  const { openSheet } = useSheetDialogStore();
  const deleteHotel = useDeleteHotel();

  const openEdit = () =>
    openSheet({
      title: `Chỉnh sửa "${hotel?.name}"`,
      content: <EditHotelForm hotelId={hotelId} />,
    });

  const handleDelete = () => {
    if (!hotel) return;
    openConfirm({
      title: "Xóa khách sạn?",
      description: `Xóa "${hotel.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteHotel.mutateAsync({ id: hotelId }),
    });
  };

  if (isLoading) return <HotelDetailSkeleton />;
  if (!hotel) return null;

  return (
    <div className="space-y-6">
      <HotelHeader hotel={hotel} onEdit={openEdit} onDelete={handleDelete} />
      <HotelStats hotel={hotel} />

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="images">Ảnh ({hotel.images.length})</TabsTrigger>
          <TabsTrigger value="rooms">Phòng ({hotel._count.rooms})</TabsTrigger>
          <TabsTrigger value="bookings">Booking ({hotel._count.bookings})</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá ({hotel._count.reviews})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <HotelInfoTab hotel={hotel} />
        </TabsContent>
        <TabsContent value="images" className="mt-4">
          <HotelImagesTab hotelId={hotelId} images={hotel.images} />
        </TabsContent>
        <TabsContent value="rooms" className="mt-4">
          <HotelRoomsTab hotelId={hotelId} />
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          <HotelBookingsTab hotelId={hotelId} />
        </TabsContent>
        <TabsContent value="reviews" className="mt-4">
          <HotelReviewsTab hotelId={hotelId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};