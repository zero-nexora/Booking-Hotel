import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ListHeaderProps {
  title: string;
  count?: number;
  countLabel?: string;
  addLabel?: string;
  onAdd?: () => void;
  children?: React.ReactNode;
}

export const ListHeader = ({
  title,
  count,
  countLabel,
  addLabel,
  onAdd,
  children,
}: ListHeaderProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {count !== undefined && (
          <p className="text-sm text-muted-foreground">
            {count} {countLabel ?? title.toLowerCase()}
          </p>
        )}
      </div>
      {onAdd && addLabel && (
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {addLabel}
        </Button>
      )}
    </div>
    {children}
  </div>
);
