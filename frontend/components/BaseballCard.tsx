"use client";
import { useEffect, useState } from "react";
import { fetchTotalUsageDuration } from "@/lib/utils";
import { Pencil } from "lucide-react";

// Helper to format seconds as h m s
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  // Only show seconds if < 1m
  if (h === 0 && m === 0) return `${seconds}s`;
  return [h > 0 ? `${h}h` : null, m > 0 ? `${m}m` : null].filter(Boolean).join(" ");
}

export default function BaseballCard({
  onEditField,
}: {
  onEditField?: (field: 'industry' | 'profession' | 'company') => void;
}) {
  const [totalUsageSeconds, setTotalUsageSeconds] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotal = async () => {
      const total = await fetchTotalUsageDuration();
      setTotalUsageSeconds(total);
      console.log('[BaseballCard] Total usage set to:', total);
    };
    fetchTotal();
  }, []);

  // Stat values (replace with props or live data as needed)
  const stats = [
    {
      emoji: "⏰",
      label: "Total AI Usage",
      value: totalUsageSeconds === null ? <span className="animate-pulse text-gray-400">--</span> : formatDuration(totalUsageSeconds),
      editable: false,
      field: undefined,
    },
    {
      emoji: "🛠️",
      label: "Avg Tools/Day",
      value: <span>6 tools</span>,
      editable: false,
      field: undefined,
    },
    {
      emoji: "📈",
      label: "Expertise",
      value: <span>6 contributions</span>,
      editable: false,
      field: undefined,
    },
    {
      emoji: "🏢",
      label: "Industry",
      value: <span>AI tech</span>,
      editable: true,
      field: 'industry',
    },
    {
      emoji: "💻",
      label: "Profession",
      value: <span>Product Management</span>,
      editable: true,
      field: 'profession',
    },
    {
      emoji: "💰",
      label: "Company",
      value: <span>Saight.ai</span>,
      editable: true,
      field: 'company',
    },
  ];

  // Split into two groups of 3 rows
  const leftStats = stats.slice(0, 3);
  const rightStats = stats.slice(3, 6);

  return (
    <div className="bg-white rounded-2xl shadow flex flex-col w-full max-w-5xl px-6 py-4">
      <div className="flex justify-center items-center mb-2">
        <span className="text-[1.05rem] font-semibold tracking-tight" style={{ fontSize: '80%' }}>⚾️ Baseball Card ⚾️</span>
      </div>
      <div className="grid grid-cols-2 gap-x-6">
        {/* Left group */}
        <div className="flex flex-col gap-[0.33rem]">
          {leftStats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center justify-between text-[0.72rem] py-[0.33rem] bg-gray-50 rounded-lg px-3"
            >
              <span className="flex items-center gap-1 min-w-[90px]">
                <span className="text-[1.1rem]">{stat.emoji}</span>
                <span className="text-gray-700 font-medium">{stat.label}</span>
              </span>
              <span className="font-bold text-[0.7rem] text-gray-900 flex items-center justify-center">
                {stat.value}
              </span>
              <span className="text-[0.65rem] text-gray-400 font-medium ml-2 whitespace-nowrap">#1 overall</span>
            </div>
          ))}
        </div>
        {/* Right group */}
        <div className="flex flex-col gap-[0.33rem]">
          {rightStats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center justify-between text-[0.72rem] py-[0.33rem] bg-gray-50 rounded-lg px-3"
            >
              <span className="flex items-center gap-1 min-w-[90px]">
                <span className="text-[1.1rem]">{stat.emoji}</span>
                <span className="text-gray-700 font-medium">{stat.label}</span>
              </span>
              {/* Center the value and pencil horizontally and vertically */}
              <span className="font-bold text-[0.7rem] text-gray-900 flex items-center justify-center text-center w-full">
                {stat.value}
                {stat.editable && stat.field && (
                  <button
                    className="ml-1 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                    onClick={() => onEditField && onEditField(stat.field as any)}
                    aria-label={`Edit ${stat.label}`}
                  >
                    <Pencil className="h-3 w-3 text-gray-500" />
                  </button>
                )}
              </span>
              <span className="text-[0.65rem] text-gray-400 font-medium ml-2 whitespace-nowrap">#1 overall</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 