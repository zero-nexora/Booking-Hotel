import { cn } from "@/lib/utils";

const checks = [
  (p: string) => p.length >= 8,
  (p: string) => /[A-Z]/.test(p),
  (p: string) => /[0-9]/.test(p),
  (p: string) => /[^A-Za-z0-9]/.test(p),
];

const COLORS = [
  "bg-destructive",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-emerald-500",
];
const LABELS = ["Yếu", "Trung bình", "Khá", "Mạnh"];

interface PasswordStrengthBarProps {
  password: string;
}

export const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  if (!password) return null;
  const strength = checks.filter((fn) => fn(password)).length;

  return (
    <div className="space-y-1.5 pt-0.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < strength ? COLORS[strength - 1] : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Độ mạnh:{" "}
        <span className="font-medium">
          {strength > 0 ? LABELS[strength - 1] : ""}
        </span>
      </p>
    </div>
  );
};
