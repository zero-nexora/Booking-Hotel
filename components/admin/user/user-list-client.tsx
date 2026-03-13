"use client";

import { useCallback } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useQueryStates } from "nuqs";
import { useConfirmDialogStore } from "@/store/confirm-dialog-store";
import { adminUserParsers } from "@/lib/search-params/admin-users";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { RouterOutput } from "@/trpc/client";
import { UserRole } from "@/generated/prisma/enums";
import { useUser } from "@/lib/auth-client";
import {
  useAdminUserList,
  useSetUserRole,
} from "@/hooks/admin/use-admin-users";
import { ListHeader } from "@/components/shared/list-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { DEFAULT_PAGE } from "@/lib/constants";

type User = RouterOutput["admin"]["user"]["list"]["items"][number];

export const UserListClient = () => {
  const { user } = useUser();
  const { openConfirm } = useConfirmDialogStore();
  const setRole = useSetUserRole();
  const [params, setParams] = useQueryStates(adminUserParsers);
  const { data, isLoading } = useAdminUserList(params);

  const handleChangeRole = useCallback(
    (userId: string, name: string, role: UserRole) =>
      openConfirm({
        title: "Đổi role?",
        description: `Đổi role của "${name}" sang ${role}?`,
        onConfirm: () => void setRole.mutateAsync({ userId, role }),
      }),
    [openConfirm, setRole],
  );

  const handleSearchChange = useCallback(
    (v: string) => setParams({ search: v }),
    [setParams],
  );

  const handleRoleChange = useCallback(
    (v: string) => setParams({ role: v === "all" ? null : (v as UserRole) }),
    [setParams],
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

  if (!user) return null;

  return (
    <div className="space-y-4">
      <ListHeader
        title="Người dùng"
        count={data?.total}
        countLabel="người dùng"
      >
        <div className="flex flex-wrap gap-3">
          <SearchInput
            value={params.search}
            onChange={handleSearchChange}
            placeholder="Tìm tên, email, sđt..."
            className="w-64"
          />
          <Select value={params.role ?? "all"} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ListHeader>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Email xác thực</TableHead>
              <TableHead className="text-center">Booking</TableHead>
              <TableHead className="text-center">Review</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          {isLoading ? (
            <TableSkeleton cols={8} />
          ) : (
            <TableBody>
              {data?.items.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  currentUserId={user.id}
                  onChangeRole={handleChangeRole}
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
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </Card>
    </div>
  );
};

interface UserRowProps {
  user: User;
  currentUserId: string;
  onChangeRole: (userId: string, name: string, role: UserRole) => void;
}

const UserRow = ({ user, currentUserId, onChangeRole }: UserRowProps) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <UserAvatar name={user.name} image={user.image} />
        <div>
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </TableCell>
    <TableCell className="text-sm">{user.phone ?? "—"}</TableCell>
    <TableCell>
      <StatusBadge status={user.role} type="role" />
    </TableCell>
    <TableCell className="text-center">
      {user.emailVerified ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
      ) : (
        <XCircle className="w-4 h-4 text-muted-foreground mx-auto" />
      )}
    </TableCell>
    <TableCell className="text-center text-sm">
      {user._count.bookings}
    </TableCell>
    <TableCell className="text-center text-sm">{user._count.reviews}</TableCell>
    <TableCell className="text-sm text-muted-foreground">
      {format(new Date(user.createdAt), "dd/MM/yyyy")}
    </TableCell>
    <TableCell>
      <UserRoleSelect
        user={user}
        currentUserId={currentUserId}
        onChangeRole={onChangeRole}
      />
    </TableCell>
  </TableRow>
);

interface UserRoleSelectProps {
  user: User;
  currentUserId: string;
  onChangeRole: (userId: string, name: string, role: UserRole) => void;
}

const UserRoleSelect = ({
  user,
  currentUserId,
  onChangeRole,
}: UserRoleSelectProps) => (
  <Select
    value={user.role}
    onValueChange={(role) => onChangeRole(user.id, user.name, role as UserRole)}
    disabled={user.id === currentUserId}
  >
    <SelectTrigger className="h-8 w-32">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="ADMIN">Admin</SelectItem>
      <SelectItem value="CUSTOMER">Customer</SelectItem>
    </SelectContent>
  </Select>
);

interface UserAvatarProps {
  name: string;
  image?: string | null;
}

const UserAvatar = ({ name, image }: UserAvatarProps) => (
  <Avatar className="w-8 h-8">
    <AvatarImage src={image ?? ""} />
    <AvatarFallback className="text-xs">
      {name.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
);
