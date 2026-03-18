import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  fullWidth?: boolean;
}

export const FormActions = ({
  onCancel,
  isPending,
  submitLabel,
  fullWidth,
}: FormActionsProps) => (
  <div className={`flex gap-2 ${fullWidth ? "pt-2" : "justify-end"}`}>
    <Button
      type="button"
      variant="outline"
      onClick={onCancel}
      className={`border-border text-foreground hover:bg-muted hover:text-foreground ${fullWidth ? "flex-1" : ""}`}
    >
      Hủy
    </Button>
    <Button
      type="submit"
      disabled={isPending}
      className={`bg-primary text-primary-foreground hover:bg-primary/90 ${fullWidth ? "flex-1" : ""}`}
    >
      {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {submitLabel}
    </Button>
  </div>
);
