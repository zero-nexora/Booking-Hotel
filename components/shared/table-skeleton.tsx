import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  cols: number;
}

export const TableSkeleton = ({ rows = 5, cols }: TableSkeletonProps) => (
  <TableBody>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        {Array.from({ length: cols }).map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-8" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);
