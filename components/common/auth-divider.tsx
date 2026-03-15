import { Separator } from "@/components/ui/separator";

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider = ({ label = "hoặc" }: AuthDividerProps) => (
  <div className="relative flex items-center gap-3 my-1">
    <Separator className="flex-1 bg-border" />
    <span className="text-xs font-medium text-muted-foreground shrink-0 px-1 select-none">
      {label}
    </span>
    <Separator className="flex-1 bg-border" />
  </div>
);
