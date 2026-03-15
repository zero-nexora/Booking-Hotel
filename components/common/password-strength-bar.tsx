import { cn } from "@/lib/utils";

const checks = [
  (p: string) => p.length >= 8,
  (p: string) => /[A-Z]/.test(p),
  (p: string) => /[0-9]/.test(p),
  (p: string) => /[^A-Za-z0-9]/.test(p),
];

const SEGMENT_COLORS = [
  "bg-destructive",
  "bg-destructive/70",
  "bg-primary/60",
  "bg-primary",
];

const LABELS = ["Yếu", "Trung bình", "Khá", "Mạnh"];

const LABEL_COLORS = [
  "text-destructive",
  "text-destructive/80",
  "text-primary/80",
  "text-primary",
];

interface PasswordStrengthBarProps {
  password: string;
}

export const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  if (!password) return null;

  const strength = checks.filter((fn) => fn(password)).length;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < strength ? SEGMENT_COLORS[strength - 1] : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Độ mạnh:{" "}
        <span
          className={cn(
            "font-medium",
            strength > 0 && LABEL_COLORS[strength - 1],
          )}
        >
          {strength > 0 ? LABELS[strength - 1] : ""}
        </span>
      </p>
    </div>
  );
};
