import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: string;
  trend?: "up" | "down";
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend, 
  description 
}: MetricCardProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
            trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            {trend === "up" ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      
      <div className="mt-2.5 space-y-0.5">
        <h3 className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
        {description && <p className="text-[10px] text-muted-foreground/60">{description}</p>}
      </div>
    </div>
  );
}
