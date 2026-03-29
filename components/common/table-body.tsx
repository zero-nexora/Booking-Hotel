import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/common/table-skeleton";

interface DataTableBodyProps<T> {
  data: T[] | undefined;
  isLoading: boolean;
  cols: number;
  emptyMessage?: string;
  renderRow: (item: T) => React.ReactNode;
}

export const DataTableBody = <T,>({
  data,
  isLoading,
  cols,
  emptyMessage = "Không tìm thấy dữ liệu",
  renderRow,
}: DataTableBodyProps<T>) => {
  if (isLoading) return <TableSkeleton cols={cols} />;

  return (
    <TableBody>
      {!data?.length ? (
        <TableRow>
          <TableCell
            colSpan={cols}
            className="h-32 text-center text-muted-foreground text-sm"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      ) : (
        data.map(renderRow)
      )}
    </TableBody>
  );
};
