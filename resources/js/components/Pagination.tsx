import React from "react";
import { Link } from "@inertiajs/react";

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

interface PaginationProps {
    links: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

export default function Pagination({
    links,
    from,
    to,
    total,
}: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    const formatLabel = (label: string) => {
        if (label.includes("Previous") || label.includes("&laquo;"))
            return "← Sebelumnya";
        if (label.includes("Next") || label.includes("&raquo;"))
            return "Berikutnya →";
        return label;
    };

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            {typeof total === "number" && (
                <p className="text-xs text-slate-500">
                    Menampilkan{" "}
                    <strong className="text-slate-700">{from || 0}</strong>–
                    <strong className="text-slate-700">{to || 0}</strong> dari{" "}
                    <strong className="text-slate-700">{total}</strong> data
                </p>
            )}

            <nav
                className="flex flex-wrap items-center gap-1.5"
                aria-label="Pagination"
            >
                {links.map((link, index) => {
                    const text = formatLabel(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-400 select-none"
                            >
                                {text}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                                link.active
                                    ? "bg-red-700 border-red-700 text-white shadow-xs"
                                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                            }`}
                        >
                            {text}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
