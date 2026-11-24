import React, { useState } from "react";

export interface ChartItem {
    label: string;
    value: number;
    color: string;
}

interface SurveyChartProps {
    title?: string | null;
    sampleSize?: string | null;
    data: ChartItem[];
}

export default function SurveyChart({
    title,
    sampleSize,
    data,
}: SurveyChartProps) {
    const [sortDescending, setSortDescending] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (!data || data.length === 0) return null;

    const displayedData = sortDescending
        ? [...data].sort((a, b) => Number(b.value) - Number(a.value))
        : data;

    const maxValue = Math.max(...displayedData.map((d) => Number(d.value)), 1);
    const totalValue = displayedData.reduce(
        (acc, item) => acc + Number(item.value),
        0,
    );

    return (
        <div className="bg-slate-950 text-white rounded-xl border border-slate-800 p-6 sm:p-8 shadow-lg">
            {/* Header Grafik */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-800">
                <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-red-400 mb-1">
                        Visualisasi Data Riset &bull; Cyrus Network
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {title || "Hasil Survei Opini Publik"}
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={() => setSortDescending(!sortDescending)}
                    className="self-start text-xs font-semibold px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer shrink-0"
                >
                    {sortDescending
                        ? "Urutan: Peringkat Tertinggi"
                        : "Urutan: Default Input"}
                </button>
            </div>

            {/* Bar Chart Interaktif */}
            <div className="space-y-5">
                {displayedData.map((item, idx) => {
                    const numericVal = Number(item.value);
                    const widthPercent = Math.min(
                        (numericVal / maxValue) * 100,
                        100,
                    );
                    const isHovered = activeIndex === idx;

                    return (
                        <div
                            key={`${item.label}-${idx}`}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className={`p-3 rounded-lg transition ${
                                isHovered
                                    ? "bg-slate-900/90 ring-1 ring-slate-700"
                                    : "bg-slate-900/40"
                            }`}
                        >
                            <div className="flex justify-between items-baseline gap-4 mb-2">
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{
                                            backgroundColor:
                                                item.color || "#b91c1c",
                                        }}
                                    />
                                    <span className="font-semibold text-sm sm:text-base text-slate-100">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="text-base sm:text-lg font-extrabold tabular-nums text-white">
                                    {numericVal.toLocaleString("id-ID", {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 2,
                                    })}
                                    %
                                </span>
                            </div>

                            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                        width: `${widthPercent}%`,
                                        backgroundColor:
                                            item.color || "#b91c1c",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stacked Proportion Bar */}
            <div className="mt-7 pt-5 border-t border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Distribusi Proporsi Responden</span>
                    <span>
                        Total Terpetakan:{" "}
                        <strong className="text-slate-200">
                            {totalValue.toLocaleString("id-ID", {
                                maximumFractionDigits: 2,
                            })}
                            %
                        </strong>
                    </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                    {displayedData.map((item, idx) => (
                        <div
                            key={`stack-${idx}`}
                            title={`${item.label}: ${item.value}%`}
                            style={{
                                width: `${(Number(item.value) / Math.max(totalValue, 100)) * 100}%`,
                                backgroundColor: item.color || "#b91c1c",
                            }}
                            className="h-full transition-all duration-500 border-r border-slate-950 last:border-r-0"
                        />
                    ))}
                </div>
            </div>

            {/* Catatan Metodologi */}
            {sampleSize && (
                <p className="mt-4 text-xs text-slate-400">
                    Metodologi &amp; Sampel:{" "}
                    <span className="text-slate-300">{sampleSize}</span>
                </p>
            )}
        </div>
    );
}
