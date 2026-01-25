"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/helpers";

type SidebarRootProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
};

type SidebarSectionProps = {
  children: ReactNode;
  className?: string;
};

function SidebarRoot({ open, onOpenChange, children, className }: SidebarRootProps) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 640px)").matches;
  });
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? 0;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) {
      return;
    }

    const endY = event.changedTouches[0]?.clientY ?? 0;
    if (endY - touchStartYRef.current > 80) {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "flex flex-col gap-4 overflow-hidden sm:rounded-none sm:pt-10",
          "max-sm:rounded-t-3xl",
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col gap-3 overflow-hidden">
          {isMobile && (
            <div className="flex justify-center">
              <div className="h-1 w-12 rounded-full bg-white/20" />
            </div>
          )}
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SidebarHeader({ children, className }: SidebarSectionProps) {
  return <SheetHeader className={cn("flex flex-col gap-3", className)}>{children}</SheetHeader>;
}

function SidebarTitle({ children, className }: SidebarSectionProps) {
  return <SheetTitle className={className}>{children}</SheetTitle>;
}

function SidebarDescription({ children, className }: SidebarSectionProps) {
  return <SheetDescription className={className}>{children}</SheetDescription>;
}

function SidebarContent({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn("space-y-4 overflow-y-auto pr-2 pb-6", className)}>{children}</div>
  );
}

function SidebarFooter({ children, className }: SidebarSectionProps) {
  return <div className={cn("p-2", className)}>{children}</div>;
}

export const Sidebar = {
  Root: SidebarRoot,
  Header: SidebarHeader,
  Title: SidebarTitle,
  Description: SidebarDescription,
  Content: SidebarContent,
  Footer: SidebarFooter,
};
