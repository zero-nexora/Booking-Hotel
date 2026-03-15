import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const RowActions = ({ onEdit, onDelete }: RowActionsProps) => (
  <div className="flex justify-end gap-1">
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={onEdit}
    >
      <Pencil className="w-3.5 h-3.5" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={onDelete}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </Button>
  </div>
);
