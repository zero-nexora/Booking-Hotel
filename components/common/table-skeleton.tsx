import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface TableSkeletonProps {
  rows?: number;
  cols: number;
}

export const TableSkeleton = ({
  rows = DEFAULT_PAGE_SIZE,
  cols,
}: TableSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i} className="border-border hover:bg-transparent">
        {Array.from({ length: cols }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-8 bg-muted" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);
