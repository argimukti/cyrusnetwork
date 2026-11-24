import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import Pagination, { PaginatedData } from "@/components/Pagination";

interface Article {
    id: number;
    title: string;
    slug: string;
    author: string;
    category: string;
    source_name: string | null;
    external_link: string | null;
    thumbnail: string | null;
    chart_data: unknown[] | null;
    excerpt: string;
    published_at: string;
}

interface PublicationsProps {
    articles: PaginatedData<Article>;
    filters: {
        search: string;
        category: string;
    };
}

export function formatTanggalJam(dateString: string): string {
    if (!dateString) return "-";
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) {
        return dateString.slice(0, 16).replace("T", " ") + " WIB";
    }

    const tanggal = parsed.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const jam = parsed.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${tanggal} • ${jam} WIB`;
}

const CATEGORIES = [
    { value: "all", label: "Semua Kategori" },
    { value: "Rilis Riset & Survei", label: "Rilis Riset & Survei" },
    { value: "Sorotan Politik", label: "Sorotan Politik" },
    { value: "Arsip Pemberitaan", label: "Arsip Pemberitaan" },
];

export default function Publications({ articles, filters }: PublicationsProps) {
    const [search, setSearch] = useState<string>(filters.search || "");

    const handleCategoryChange = (cat: string) => {
        router.get(
            "/publikasi",
            { category: cat, search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/publikasi",
            { category: filters.category || "all", search },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <MainLayout>
            <Head title="Publikasi, Hasil Riset & Survei — Cyrus Network" />

            <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Publikasi &amp; Rilis Data
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
                        Hasil Riset, Survei Opini Publik &amp; Analisis
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
                        Kumpulan temuan survei elektoral, kajian kebijakan
                        publik, serta ulasan strategis dari tim peneliti Cyrus
                        Network.
                    </p>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Bar Filter & Pencarian */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() =>
                                        handleCategoryChange(cat.value)
                                    }
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        (filters.category || "all") ===
                                        cat.value
                                            ? "bg-red-700 text-white"
                                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul riset atau peneliti..."
                                className="w-full sm:w-64 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
                            />
                            <button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition cursor-pointer shrink-0"
                            >
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Grid Kartu Publikasi */}
                    {articles.data.length === 0 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                            <p className="text-slate-600 font-medium">
                                Belum ada publikasi yang sesuai dengan kriteria
                                pencarian Anda.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                                {articles.data.map((article) => (
                                    <article
                                        key={article.id}
                                        className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition"
                                    >
                                        {article.thumbnail ? (
                                            <Link
                                                href={`/publikasi/${article.slug}`}
                                                className="block h-48 overflow-hidden bg-slate-100"
                                            >
                                                <img
                                                    src={`/storage/${article.thumbnail}`}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                                />
                                            </Link>
                                        ) : (
                                            <Link
                                                href={`/publikasi/${article.slug}`}
                                                className="h-48 bg-slate-900 flex flex-col justify-between p-6 text-white"
                                            >
                                                <span className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                                                    {article.category}
                                                </span>
                                                <span className="text-sm font-bold line-clamp-2 text-slate-100">
                                                    {article.title}
                                                </span>
                                            </Link>
                                        )}

                                        <div className="p-6 flex flex-col grow">
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-700 mb-2">
                                                <span>{article.category}</span>
                                                {article.chart_data &&
                                                    article.chart_data.length >
                                                        0 && (
                                                        <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px]">
                                                            Data Grafik
                                                        </span>
                                                    )}
                                            </div>

                                            <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                                                <Link
                                                    href={`/publikasi/${article.slug}`}
                                                    className="hover:text-red-700 transition"
                                                >
                                                    {article.title}
                                                </Link>
                                            </h2>

                                            <p className="text-xs text-slate-500 mb-3">
                                                Oleh{" "}
                                                <strong>
                                                    {article.author}
                                                </strong>{" "}
                                                &bull;{" "}
                                                {formatTanggalJam(
                                                    article.published_at,
                                                )}
                                            </p>

                                            <p className="text-sm text-slate-600 line-clamp-3 mb-5 grow leading-relaxed">
                                                {article.excerpt}
                                            </p>

                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <Link
                                                    href={`/publikasi/${article.slug}`}
                                                    className="text-xs font-bold text-red-700 hover:underline"
                                                >
                                                    Baca Laporan Lengkap &rarr;
                                                </Link>
                                                {article.source_name && (
                                                    <span className="text-[11px] text-slate-400">
                                                        {article.source_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <Pagination
                                links={articles.links}
                                from={articles.from}
                                to={articles.to}
                                total={articles.total}
                            />
                        </>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
