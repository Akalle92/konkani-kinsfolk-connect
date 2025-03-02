
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: "default" | "large" | "small";
  variant?: "default" | "outlined";
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  size = "default",
  variant = "default",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg p-8 text-center animate-fade-in",
        variant === "outlined" && "border border-dashed border-muted-foreground/30",
        size === "small" && "p-4 gap-3",
        size === "large" && "p-12 gap-6",
        size === "default" && "gap-4",
        className
      )}
      {...props}
    >
      {icon && (
        <div className={cn(
          "text-muted-foreground mb-2",
          size === "large" && "text-6xl mb-4",
          size === "small" && "text-2xl"
        )}>
          {icon}
        </div>
      )}
      
      <h3 className={cn(
        "font-semibold text-foreground",
        size === "large" && "text-2xl",
        size === "small" && "text-base"
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          "text-muted-foreground max-w-sm",
          size === "large" && "text-lg",
          size === "small" && "text-sm"
        )}>
          {description}
        </p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          className={cn(
            "mt-2",
            size === "large" && "mt-4",
          )}
          size={size === "small" ? "sm" : "default"}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
