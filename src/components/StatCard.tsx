import React from 'react';

interface StatCardProps {
  tag: string;
  label: string;
  value: string;
  sublabel?: string;
  unit?: string;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  tag,
  label,
  value,
  sublabel,
  unit,
  index,
}) => {
  return (
    <div
      style={{ animationDelay: `${index * 80}ms` }}
      className="bg-zinc-950/90 border border-zinc-800/80 hover:border-zinc-700 p-4 sm:p-5 rounded-xl flex flex-col justify-between transition-all duration-300 hover:bg-zinc-900/40 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
          {tag}
        </span>
      </div>

      <div className="my-1">
        <div className="font-mono font-bold text-2xl sm:text-3xl text-white tracking-tight tabular-nums group-hover:text-electric-lime transition-colors">
          {value}
        </div>
        {unit && (
          <div className="text-xs font-mono text-zinc-400 mt-0.5">
            {unit}
          </div>
        )}
      </div>

      {sublabel && (
        <div className="text-[11px] font-sans text-zinc-500 mt-2 border-t border-zinc-900 pt-2 leading-relaxed">
          {sublabel}
        </div>
      )}
    </div>
  );
};
