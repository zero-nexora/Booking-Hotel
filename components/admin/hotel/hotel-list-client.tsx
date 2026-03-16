"use client";

import { Card } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback } from "react";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { useSheetDialogStore } from "@/store/sheet-dialog-store";
import { adminHotelParsers } from "@/lib/search-params/admin-hotels";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { CreateHotelForm, EditHotelForm } from "./hotel-form-sheet";
import { RouterOutput } from "@/trpc/client";
import { HotelStatus } from "@/generated/prisma/enums";
import {
  useAdminHotelList,
  useDeleteHotel,
} from "@/hooks/admin/use-admin-hotels";
import { useCityList, useCountryList } from "@/hooks/admin/use-admin-locations";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { DEFAULT_PAGE } from "@/lib/constants";

type Hotel = RouterOutput["admin"]["hotel"]["list"]["items"][number];

export const HotelListClient = () => {
  const router = useRouter();
  const { openConfirm } = useConfirmDialogStore();
  const { openSheet } = useSheetDialogStore();
  const deleteHotel = useDeleteHotel();
  const [params, setParams] = useQueryStates(adminHotelParsers);
  const { data, isLoading } = useAdminHotelList(params);

  const { data: countries = [] } = useCountryList();
  const { data: cities = [] } = useCityList(params.countryId || undefined);

  const openCreate = useCallback(
    () => openSheet({ title: "Thêm khách sạn", content: <CreateHotelForm /> }),
    [openSheet],
  );

  const openEdit = useCallback(
    (hotel: Hotel) =>
      openSheet({
        title: `Chỉnh sửa "${hotel.name}"`,
        content: <EditHotelForm hotelId={hotel.id} />,
      }),
    [openSheet],
  );

  const handleDelete = useCallback(
    (hotel: Hotel) =>
      openConfirm({
        title: "Xóa khách sạn?",
        description: `Xóa "${hotel.name}"? Hành động này không thể hoàn tác.`,
        variant: "destructive",
        onConfirm: () => void deleteHotel.mutateAsync({ id: hotel.id }),
      }),
    [openConfirm, deleteHotel],
  );

  const handleSearchChange = useCallback(
    (v: string) => setParams({ search: v, page: DEFAULT_PAGE }),
    [setParams],
  );

  const handleStatusChange = useCallback(
    (v: string) =>
      setParams({
        status: v === "all" ? null : (v as HotelStatus),
        page: DEFAULT_PAGE,
      }),
    [setParams],
  );

  const handleStarChange = useCallback(
    (v: string) =>
      setParams({
        starRating: v === "all" ? null : Number(v),
        page: DEFAULT_PAGE,
      }),
    [setParams],
  );

  const handleCountryChange = useCallback(
    (v: string) =>
      setParams({
        countryId: v === "all" ? null : v,
        cityId: "",
        page: DEFAULT_PAGE,
      }),
    [setParams],
  );

  const handleCityChange = useCallback(
    (v: string) =>
      setParams({ cityId: v === "all" ? null : v, page: DEFAULT_PAGE }),
    [setParams],
  );

  const handleNavigate = useCallback(
    (id: string) => router.push(`/admin/hotels/${id}`),
    [router],
  );

  const handlePageChange = useCallback(
    (p: number) => setParams((prev) => ({ ...prev, page: p })),
    [setParams],
  );

  const handleLimitChange = useCallback(
    (l: number) =>
      setParams((prev) => ({ ...prev, limit: l, page: DEFAULT_PAGE })),
    [setParams],
  );

  return (
    <div className="space-y-4">
      <ListHeader
        title="Khách sạn"
        count={data?.total}
        countLabel="khách sạn"
        addLabel="Thêm khách sạn"
        onAdd={openCreate}
      >
        <div className="flex flex-wrap gap-3">
          <SearchInput
            value={params.search}
            onChange={handleSearchChange}
            placeholder="Tìm tên khách sạn..."
            className="w-64"
          />
          <Select
            value={params.status ?? "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-44 border-border bg-background text-foreground">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả trạng thái
              </SelectItem>
              <SelectItem
                value="ACTIVE"
                className="text-foreground hover:bg-muted"
              >
                Hoạt động
              </SelectItem>
              <SelectItem
                value="INACTIVE"
                className="text-foreground hover:bg-muted"
              >
                Không hoạt động
              </SelectItem>
              <SelectItem
                value="MAINTENANCE"
                className="text-foreground hover:bg-muted"
              >
                Bảo trì
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={params.starRating ? String(params.starRating) : "all"}
            onValueChange={handleStarChange}
          >
            <SelectTrigger className="w-36 border-border bg-background text-foreground">
              <SelectValue placeholder="Hạng sao" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả sao
              </SelectItem>
              {[1, 2, 3, 4, 5].map((s) => (
                <SelectItem
                  key={s}
                  value={String(s)}
                  className="text-foreground hover:bg-muted"
                >
                  {s} sao
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.countryId || "all"}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger className="w-44 border-border bg-background text-foreground">
              <SelectValue placeholder="Quốc gia" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
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
          <Select
            value={params.cityId || "all"}
            onValueChange={handleCityChange}
            disabled={!params.countryId}
          >
            <SelectTrigger className="w-44 border-border bg-background text-foreground disabled:opacity-50">
              <SelectValue placeholder="Thành phố" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem
                value="all"
                className="text-foreground hover:bg-muted"
              >
                Tất cả thành phố
              </SelectItem>
              {cities.map((c) => (
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
        </div>
      </ListHeader>

      <Card className="bg-card border-border shadow-none">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">
                Khách sạn
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Địa điểm
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Sao
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                Trạng thái
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Phòng
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Booking
              </TableHead>
              <TableHead className="text-center text-muted-foreground font-medium">
                Review
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : (
            <TableBody>
              {data?.items.map((hotel) => (
                <HotelRow
                  key={hotel.id}
                  hotel={hotel}
                  onNavigate={handleNavigate}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          )}
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

interface HotelRowProps {
  hotel: Hotel;
  onNavigate: (id: string) => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const HotelRow = ({ hotel, onNavigate, onEdit, onDelete }: HotelRowProps) => (
  <TableRow
    className="border-border hover:bg-muted/40 cursor-pointer"
    onClick={() => onNavigate(hotel.id)}
  >
    <TableCell>
      <div>
        <p className="font-medium text-sm text-foreground">{hotel.name}</p>
        <p className="text-xs text-muted-foreground">{hotel.slug}</p>
      </div>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {hotel.address.city.name}, {hotel.address.city.country.name}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
        <span className="text-sm text-foreground">{hotel.starRating}</span>
      </div>
    </TableCell>
    <TableCell>
      <StatusBadge status={hotel.status} type="hotel" />
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {hotel._count.rooms}
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {hotel._count.bookings}
    </TableCell>
    <TableCell className="text-center text-sm text-muted-foreground">
      {hotel._count.reviews}
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
          onClick={() => onEdit(hotel)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(hotel)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
