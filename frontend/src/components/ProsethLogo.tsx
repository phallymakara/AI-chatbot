import { cn } from "@/lib/utils";
import logo from "@/assets/logo_proseth.svg";

interface ProsethLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl"; // Added 2xl
  className?: string;
}

export function ProsethLogo({
  size = "md",
  className,
}: ProsethLogoProps) {
  const sizeClasses = {
    sm: "h-5",
    md: "h-7",
    lg: "h-10",
    xl: "h-14", // Significantly larger
    "2xl": "h-18", // For massive presence
  };

  return (
    <div className={cn("flex items-center justify-start", className)}>
      <img
        src={logo}
        alt="Logo"
        className={cn(
          sizeClasses[size],
          "w-auto max-w-none object-contain block", // Changed max-w-full to max-w-none
        )}
      />
    </div>
  );
}
