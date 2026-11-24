import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";

interface Inquiry {
    id: number;
    name: string;
    institution: string | null;
    email: string;
    phone: string | null;
    service_type: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface PendingArticle {
    id: number;
    title: string;
    author: string;
    category: string;
    excerpt: string;
    published_at: string;
}

interface DashboardProps {
    stats: {
        articles_count: number;
        pending_articles: number;
        services_count: number;
        unread_inquiries: number;
    };
    inquiries: Inquiry[];
    pendingArticles: PendingArticle[];
}

export default function Dashboard({
    stats,
    inquiries,
    pendingArticles,
}: DashboardProps) {
    const { props } = usePage<{
        auth?: { user?: { name: string; role?: string } };
    }>();
    const role = props.auth?.user?.role || "peneliti";
    const canViewInquiries = role === "admin" || role === "humas";
    const canApprove = role === "admin" || role === "leader";

    const handleMarkRead = (id: number) => {
        router.patch(
            `/admin/inquiries/${id}/read`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm("Hapus pesan konsultasi ini?")) {
            router.delete(`/admin/inquiries/${id}`, { preserveScroll: true });
        }
    };

    const handleQuickApprove = (id: number) => {
        if (confirm("Setujui dan terbitkan publikasi ini ke website?")) {
            router.patch(
                `/admin/articles/${id}/approve`,
                {},
                { preserveScroll: true },
            );
        }
    };

    return (
        <AdminLayout>
            <Head title="Dashboard — Cyrus Network" />

            {/* Header Sambutan */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Selamat Datang, {props.auth?.user?.name}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                    Ringkasan aktivitas, persetujuan publikasi, dan pengelolaan
                    konten Cyrus Network.
                </p>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-amber-500 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Menunggu Approval
                        </p>
                        <p className="text-3xl font-extrabold text-amber-600 mt-2">
                            {stats.pending_articles}
                        </p>
                    </div>
                    {(canApprove || role === "peneliti") && (
                        <Link
                            href="/admin/articles"
                            className="text-xs font-semibold text-amber-700 hover:underline"
                        >
                            Tinjau &rarr;
                        </Link>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-slate-900 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Publikasi Tayang
                        </p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-2">
                            {stats.articles_count}
                        </p>
                    </div>
                    {(canApprove || role === "peneliti") && (
                        <Link
                            href="/admin/articles"
                            className="text-xs font-semibold text-red-700 hover:underline"
                        >
                            Kelola &rarr;
                        </Link>
                    )}
                </div>

                {canViewInquiries && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-red-700 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Pesan Belum Dibaca
                            </p>
                            <p className="text-3xl font-extrabold text-red-700 mt-2">
                                {stats.unread_inquiries}
                            </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                            Kotak Masuk
                        </span>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl border border-slate-200 border-l-4 border-l-blue-700 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Layanan Aktif
                        </p>
                        <p className="text-3xl font-extrabold text-slate-900 mt-2">
                            {stats.services_count}
                        </p>
                    </div>
                    {canViewInquiries && (
                        <Link
                            href="/admin/services"
                            className="text-xs font-semibold text-red-700 hover:underline"
                        >
                            Kelola &rarr;
                        </Link>
                    )}
                </div>
            </div>

            {/* Antrean Approval Khusus Leader & Super Admin */}
            {canApprove && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-8">
                    <div className="px-6 py-4 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Antrean Persetujuan Publikasi (
                                {pendingArticles.length})
                            </h2>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Naskah dari Tim Riset belum akan tampil di
                                website publik sebelum Anda setujui.
                            </p>
                        </div>
                        <Link
                            href="/admin/articles"
                            className="text-xs font-semibold text-red-700 hover:underline"
                        >
                            Buka Semua Publikasi &rarr;
                        </Link>
                    </div>

                    {pendingArticles.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Tidak ada naskah yang menunggu persetujuan saat ini.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {pendingArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                                                Menunggu Approval
                                            </span>
                                            <span className="font-semibold text-red-700 uppercase">
                                                {article.category}
                                            </span>
                                            <span>&bull;</span>
                                            <span>
                                                Penulis:{" "}
                                                <strong>
                                                    {article.author}
                                                </strong>
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-900">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <button
                                            onClick={() =>
                                                handleQuickApprove(article.id)
                                            }
                                            className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-md transition cursor-pointer"
                                        >
                                            Setujui &amp; Terbitkan
                                        </button>
                                        <Link
                                            href="/admin/articles"
                                            className="text-xs font-semibold text-slate-700 hover:underline"
                                        >
                                            Tinjau Detail
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Panel Aksi Cepat Khusus Tim Riset */}
            {role === "peneliti" && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Pengajuan Hasil Survei &amp; Analisis
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Setiap naskah yang Anda ajukan akan masuk ke antrean{" "}
                            <strong>Leader</strong> untuk ditinjau sebelum
                            diterbitkan ke publik.
                        </p>
                    </div>
                    <Link
                        href="/admin/articles"
                        className="bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shrink-0"
                    >
                        Buat / Cek Status Naskah &rarr;
                    </Link>
                </div>
            )}

            {/* Kotak Masuk Khusus Super Admin & Humas */}
            {canViewInquiries && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">
                            Permintaan Konsultasi &amp; Kontak (
                            {inquiries.length})
                        </h2>
                    </div>

                    {inquiries.length === 0 ? (
                        <div className="p-12 text-center text-sm text-slate-500">
                            Belum ada pesan masuk dari formulir kontak website.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200">
                            {inquiries.map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-6 transition ${item.is_read ? "bg-white" : "bg-red-50/40"}`}
                                >
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900">
                                                    {item.name}
                                                </span>
                                                {item.institution && (
                                                    <span className="text-xs text-slate-500">
                                                        ({item.institution})
                                                    </span>
                                                )}
                                                {!item.is_read && (
                                                    <span className="text-[11px] font-bold bg-red-700 text-white px-2 py-0.5 rounded">
                                                        Baru
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {item.email}{" "}
                                                {item.phone
                                                    ? `• ${item.phone}`
                                                    : ""}{" "}
                                                &bull; Topik:{" "}
                                                <strong className="text-slate-700">
                                                    {item.service_type}
                                                </strong>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {!item.is_read && (
                                                <button
                                                    onClick={() =>
                                                        handleMarkRead(item.id)
                                                    }
                                                    className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                                                >
                                                    Tandai Dibaca
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-700 mt-3 whitespace-pre-line bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                                        {item.message}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
}
