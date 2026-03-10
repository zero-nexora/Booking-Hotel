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

  const openCreate = () =>
    openSheet({
      title: "Thêm khách sạn",
      content: <CreateHotelForm />,
    });

  const openEdit = (hotel: Hotel) =>
    openSheet({
      title: `Chỉnh sửa "${hotel.name}"`,
      content: <EditHotelForm hotelId={hotel.id} />,
    });

  const handleDelete = (hotel: Hotel) =>
    openConfirm({
      title: "Xóa khách sạn?",
      description: `Xóa "${hotel.name}"? Hành động này không thể hoàn tác.`,
      variant: "destructive",
      onConfirm: () => void deleteHotel.mutateAsync({ id: hotel.id }),
    });

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
            onChange={(v) => setParams({ search: v, page: DEFAULT_PAGE })}
            placeholder="Tìm tên khách sạn..."
            className="w-64"
          />
          <Select
            value={params.status ?? "all"}
            onValueChange={(v) =>
              setParams({
                status: v === "all" ? null : (v as HotelStatus),
                page: DEFAULT_PAGE,
              })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={params.starRating ? String(params.starRating) : "all"}
            onValueChange={(v) =>
              setParams({
                starRating: v === "all" ? null : Number(v),
                page: DEFAULT_PAGE,
              })
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Hạng sao" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sao</SelectItem>
              {[1, 2, 3, 4, 5].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s} sao
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.countryId || "all"}
            onValueChange={(v) =>
              setParams({
                countryId: v === "all" ? null : v,
                cityId: "",
                page: DEFAULT_PAGE,
              })
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Quốc gia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả quốc gia</SelectItem>
              {countries.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={params.cityId || "all"}
            onValueChange={(v) =>
              setParams({ cityId: v === "all" ? null : v, page: DEFAULT_PAGE })
            }
            disabled={!params.countryId}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Thành phố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thành phố</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ListHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách sạn</TableHead>
              <TableHead>Địa điểm</TableHead>
              <TableHead>Sao</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Phòng</TableHead>
              <TableHead className="text-center">Booking</TableHead>
              <TableHead className="text-center">Review</TableHead>
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
                  onNavigate={() => router.push(`/admin/hotels/${hotel.id}`)}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          )}
        </Table>
        {data && (
          <Pagination
            page={params.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={params.limit}
            onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
            onLimitChange={(l) =>
              setParams((prev) => ({ ...prev, limit: l, page: DEFAULT_PAGE }))
            }
          />
        )}
      </Card>
    </div>
  );
};

interface HotelRowProps {
  hotel: Hotel;
  onNavigate: () => void;
  onEdit: (hotel: Hotel) => void;
  onDelete: (hotel: Hotel) => void;
}

const HotelRow = ({ hotel, onNavigate, onEdit, onDelete }: HotelRowProps) => (
  <TableRow className="cursor-pointer" onClick={onNavigate}>
    <TableCell>
      <div>
        <p className="font-medium text-sm">{hotel.name}</p>
        <p className="text-xs text-muted-foreground">{hotel.slug}</p>
      </div>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {hotel.address.city.name}, {hotel.address.city.country.name}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-sm">{hotel.starRating}</span>
      </div>
    </TableCell>
    <TableCell>
      <StatusBadge status={hotel.status} type="hotel" />
    </TableCell>
    <TableCell className="text-center text-sm">{hotel._count.rooms}</TableCell>
    <TableCell className="text-center text-sm">
      {hotel._count.bookings}
    </TableCell>
    <TableCell className="text-center text-sm">
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
          className="h-8 w-8"
          onClick={() => onEdit(hotel)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={() => onDelete(hotel)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);
