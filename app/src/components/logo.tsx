import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  onlyIcon?: boolean;
  className?: string;
}

export function Logo({ onlyIcon = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg className="size-7 text-primary" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </svg>

      {!onlyIcon && <span className="text-xl font-bold">{siteConfig.name}</span>}
    </div>
  );
}
