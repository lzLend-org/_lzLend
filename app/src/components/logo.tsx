import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  onlyIcon?: boolean;
  className?: string;
}

export function Logo({ onlyIcon = false, className }: LogoProps) {
  return (
    <Link href={"/"} className={cn("flex items-center gap-2", className)}>
      <svg className="size-7 text-primary" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="5" width="16" height="16" fill="currentColor" />
      </svg>

      {!onlyIcon && <span className="font-mono text-xl font-bold">{siteConfig.name}</span>}
    </Link>
  );
}
