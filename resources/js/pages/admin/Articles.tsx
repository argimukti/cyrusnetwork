import React, { useRef, useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import SurveyChart, { ChartItem } from "@/components/SurveyChart";
import Pagination, { PaginatedData } from "@/components/Pagination";

interface Article {
    id: number;
    title: string;
    slug?: string;
    author: string;
    category: string;
    source_name: string | null;
    external_link: string | null;
    thumbnail: string | null;
    chart_title: string | null;
    sample_size: string | null;
    chart_data: ChartItem[] | null;
    published_at: string;
    excerpt: string;
    content: string;
    status: "pending" | "published" | "rejected";
    rejection_note: string | null;
    approved_by: string | null;
}

interface ArticlesProps {
    articles: PaginatedData<Article>;
    counts: {
        all: number;
        pending: number;
        published: number;
        rejected: number;
    };
    filters: {
        status: string;
        search: string;
    };
}

const PRESET_COLORS = ["#b91c1c", "#1d4ed8", "#047857", "#d97706", "#64748b"];

export default function Articles({ articles, counts, filters }: ArticlesProps) {
    const { props } = usePage<{
        auth?: { user?: { name: string; role?: string } };
    }>();
    const role = props.auth?.user?.role || "peneliti";
    const canApprove = role === "admin" || role === "leader";

    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState<string>(filters.search || "");
    const [rejectingId, setRejectingId] = useState<number | null>(null);
    const [rejectionNote, setRejectionNote] = useState<string>("");
    const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
    const [modalRejectMode, setModalRejectMode] = useState<boolean>(false);
    const [modalRejectNote, setModalRejectNote] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        author: string;
        category: string;
        source_name: string;
        external_link: string;
        thumbnail: File | null;
        chart_title: string;
        sample_size: string;
        chart_data: ChartItem[];
        excerpt: string;
        content: string;
        published_at: string;
    }>({
        title: "",
        author: props.auth?.user?.name || "Tim Riset Cyrus Network",
        category: "Rilis Riset & Survei",
        source_name: "",
        external_link: "",
        thumbnail: null,
        chart_title: "",
        sample_size: "",
        chart_data: [],
        excerpt: "",
        content: "",
        published_at: getCurrentDateTimeLocal(),
    });

    const resetForm = () => {
        setEditingId(null);
        reset();
        setData("author", props.auth?.user?.name || "Tim Riset Cyrus Network");
        setData("published_at", getCurrentDateTimeLocal());
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (article: Article) => {
        setEditingId(article.id);
        setData({
            title: article.title,
            author: article.author || "Tim Riset Cyrus Network",
            category: article.category,
            source_name: article.source_name || "",
            external_link: article.external_link || "",
            thumbnail: null,
            chart_title: article.chart_title || "",
            sample_size: article.sample_size || "",
            chart_data: article.chart_data || [],
            excerpt: article.excerpt,
            content: article.content,
            published_at: article.published_at.replace(" ", "T").slice(0, 16),
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFilterStatus = (status: string) => {
        router.get(
            "/admin/articles",
            { status, search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/articles",
            { status: filters.status || "all", search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const addChartRow = () => {
        const nextColor =
            PRESET_COLORS[data.chart_data.length % PRESET_COLORS.length];
        setData("chart_data", [
            ...data.chart_data,
            { label: "", value: 0, color: nextColor },
        ]);
    };

    const updateChartRow = (
        index: number,
        field: keyof ChartItem,
        value: string | number,
    ) => {
        const updated = [...data.chart_data];
        updated[index] = { ...updated[index], [field]: value };
        setData("chart_data", updated);
    };

    const removeChartRow = (index: number) => {
        setData(
            "chart_data",
            data.chart_data.filter((_, i) => i !== index),
        );
    };

    const fillSampleChart = () => {
        setData((prev) => ({
            ...prev,
            chart_title:
                "Tingkat Kepuasan Publik Terhadap Kinerja Sektor Strategis",
            sample_size:
                "1.200 Responden di 38 Provinsi • Margin of Error ±2,83%",
            chart_data: [
                { label: "Sangat Puas", value: 18.4, color: "#047857" },
                { label: "Cukup Puas", value: 54.2, color: "#1d4ed8" },
                { label: "Kurang Puas", value: 19.6, color: "#d97706" },
                {
                    label: "Tidak Puas / Tidak Jawab",
                    value: 7.8,
                    color: "#64748b",
                },
            ],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            router.post(
                `/admin/articles/${editingId}`,
                {
                    _method: "put",
                    ...data,
                } as Record<string, any>,
                {
                    forceFormData: true,
                    onSuccess: () => resetForm(),
                },
            );
        } else {
            post("/admin/articles", {
                forceFormData: true,
                onSuccess: () => resetForm(),
            });
        }
    };

    const openPreview = (article: Article) => {
        setPreviewArticle(article);
        setModalRejectMode(false);
        setModalRejectNote(article.rejection_note || "");
    };

    const closePreview = () => {
        setPreviewArticle(null);
        setModalRejectMode(false);
        setModalRejectNote("");
    };

    const handleApprove = (id: number) => {
        router.patch(
            `/admin/articles/${id}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => closePreview(),
            },
        );
    };

    const handleRejectSubmit = (
        id: number,
        noteValue: string,
        fromModal = false,
    ) => {
        if (noteValue.trim().length < 5) {
            alert(
                "Tuliskan catatan revisi minimal 5 karakter agar peneliti mengetahui bagian yang perlu diperbaiki.",
            );
            return;
        }
        router.patch(
            `/admin/articles/${id}/reject`,
            { rejection_note: noteValue },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (fromModal) {
                        closePreview();
                    } else {
                        setRejectingId(null);
                        setRejectionNote("");
                    }
                },
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus publikasi ini?")) {
            router.delete(`/admin/articles/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Publikasi & Riset — Admin Cyrus Network" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Kelola Hasil Riset, Survei &amp; Publikasi
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                    {canApprove
                        ? "Pratinjau naskah beserta grafik survei sebelum menyetujui atau meminta revisi ke Tim Riset."
                        : "Setiap naskah baru atau revisi akan dikirim ke Leader untuk disetujui sebelum tayang."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Tambah / Edit */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? "Edit Naskah Publikasi"
                                    : "Buat Naskah Riset / Berita"}
                            </h2>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                                >
                                    Batal Edit
                                </button>
                            )}
                        </div>

                        {!canApprove && (
                            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                                <strong>Info Alur:</strong> Naskah yang Anda
                                simpan berstatus{" "}
                                <strong>Menunggu Approval</strong> dan baru akan
                                tampil di website setelah disetujui Leader.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Judul Riset / Publikasi *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Misal: Survei Opini Publik Nasional..."
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nama Penulis / Peneliti *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.author}
                                        onChange={(e) =>
                                            setData("author", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    />
                                    {errors.author && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.author}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Tanggal &amp; Jam Terbit *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) =>
                                            setData(
                                                "published_at",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-white"
                                    >
                                        <option value="Rilis Riset & Survei">
                                            Rilis Riset &amp; Survei
                                        </option>
                                        <option value="Sorotan Politik">
                                            Sorotan Politik
                                        </option>
                                        <option value="Arsip Pemberitaan">
                                            Arsip Pemberitaan
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Gambar Sampul (Opsional, Maks 2MB)
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                "thumbnail",
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700"
                                    />
                                </div>
                            </div>

                            {/* Builder Grafik Interaktif */}
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                        Data Grafik Survei Interaktif (Opsional)
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={fillSampleChart}
                                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                                        >
                                            Isi Contoh Data
                                        </button>
                                        <button
                                            type="button"
                                            onClick={addChartRow}
                                            className="text-xs font-semibold bg-slate-900 text-white px-2.5 py-1 rounded hover:bg-slate-800 cursor-pointer"
                                        >
                                            + Tambah Baris
                                        </button>
                                    </div>
                                </div>

                                {data.chart_data.length > 0 && (
                                    <>
                                        <input
                                            type="text"
                                            value={data.chart_title}
                                            onChange={(e) =>
                                                setData(
                                                    "chart_title",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs"
                                            placeholder="Judul Grafik (misal: Elektabilitas / Tingkat Kepuasan)"
                                        />
                                        <input
                                            type="text"
                                            value={data.sample_size}
                                            onChange={(e) =>
                                                setData(
                                                    "sample_size",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs"
                                            placeholder="Catatan Sampel (misal: 1.200 Responden • MoE ±2,83%)"
                                        />

                                        <div className="space-y-2">
                                            {data.chart_data.map((row, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="color"
                                                        value={row.color}
                                                        onChange={(e) =>
                                                            updateChartRow(
                                                                idx,
                                                                "color",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-8 h-8 rounded border border-slate-300 cursor-pointer shrink-0"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={row.label}
                                                        onChange={(e) =>
                                                            updateChartRow(
                                                                idx,
                                                                "label",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Label / Opsi"
                                                        className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                                                    />
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        max="100"
                                                        value={row.value}
                                                        onChange={(e) =>
                                                            updateChartRow(
                                                                idx,
                                                                "value",
                                                                parseFloat(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                        placeholder="%"
                                                        className="w-20 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeChartRow(idx)
                                                        }
                                                        className="text-xs font-bold text-red-600 px-1.5 hover:text-red-800 cursor-pointer"
                                                        title="Hapus baris"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Sumber Media (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.source_name}
                                        onChange={(e) =>
                                            setData(
                                                "source_name",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="Misal: Internal, Kumparan"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Link Eksternal (Opsional)
                                    </label>
                                    <input
                                        type="url"
                                        value={data.external_link}
                                        onChange={(e) =>
                                            setData(
                                                "external_link",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Ringkasan / Temuan Utama *
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData("excerpt", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                />
                                {errors.excerpt && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.excerpt}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Isi Laporan Riset / Analisis Lengkap *
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.content}
                                    onChange={(e) =>
                                        setData("content", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                />
                                {errors.content && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.content}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition cursor-pointer"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : editingId
                                      ? "Simpan Perubahan"
                                      : canApprove
                                        ? "Terbitkan Langsung"
                                        : "Ajukan ke Leader (Approval)"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Daftar Publikasi & Antrean Approval */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                        {/* Header Tab Filter Status & Pencarian */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-base font-bold text-slate-900">
                                    Daftar Naskah &amp; Publikasi (
                                    {articles.total})
                                </h2>

                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterStatus("all")
                                        }
                                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                            (filters.status || "all") === "all"
                                                ? "bg-slate-900 text-white"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        Semua ({counts.all})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterStatus("pending")
                                        }
                                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                            filters.status === "pending"
                                                ? "bg-amber-600 text-white"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        Menunggu ({counts.pending})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterStatus("published")
                                        }
                                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                            filters.status === "published"
                                                ? "bg-emerald-700 text-white"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        Tayang ({counts.published})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterStatus("rejected")
                                        }
                                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                                            filters.status === "rejected"
                                                ? "bg-red-700 text-white"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                        }`}
                                    >
                                        Revisi ({counts.rejected})
                                    </button>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari judul naskah, penulis, atau kategori..."
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900"
                                />
                                <button
                                    type="submit"
                                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer shrink-0"
                                >
                                    Cari
                                </button>
                            </form>
                        </div>

                        {articles.data.length === 0 ? (
                            <div className="p-10 text-center text-sm text-slate-500">
                                Tidak ada data publikasi yang sesuai filter atau
                                pencarian.
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-slate-200">
                                    {articles.data.map((article) => (
                                        <div
                                            key={article.id}
                                            className={`p-6 ${
                                                article.status === "pending"
                                                    ? "bg-amber-50/30"
                                                    : article.status ===
                                                        "rejected"
                                                      ? "bg-red-50/30"
                                                      : "bg-white"
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
                                                        {article.status ===
                                                            "published" && (
                                                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                                                Tayang
                                                            </span>
                                                        )}
                                                        {article.status ===
                                                            "pending" && (
                                                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                                                                Menunggu
                                                                Approval
                                                            </span>
                                                        )}
                                                        {article.status ===
                                                            "rejected" && (
                                                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                                                                Perlu Revisi
                                                            </span>
                                                        )}

                                                        <span className="font-bold text-red-700 uppercase">
                                                            {article.category}
                                                        </span>
                                                        {article.chart_data &&
                                                            article.chart_data
                                                                .length > 0 && (
                                                                <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-semibold">
                                                                    + Grafik
                                                                </span>
                                                            )}
                                                    </div>

                                                    <h3 className="font-bold text-slate-900 text-base">
                                                        {article.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Penulis:{" "}
                                                        <strong>
                                                            {article.author}
                                                        </strong>{" "}
                                                        &bull;{" "}
                                                        {article.published_at.slice(
                                                            0,
                                                            16,
                                                        )}{" "}
                                                        WIB
                                                        {article.approved_by && (
                                                            <>
                                                                {" "}
                                                                &bull;
                                                                Disetujui:{" "}
                                                                <strong>
                                                                    {
                                                                        article.approved_by
                                                                    }
                                                                </strong>
                                                            </>
                                                        )}
                                                    </p>

                                                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                                                        {article.excerpt}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openPreview(article)
                                                        }
                                                        className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                                                    >
                                                        Pratinjau
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(article)
                                                        }
                                                        className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                article.id,
                                                            )
                                                        }
                                                        className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Catatan Revisi jika Ditolak */}
                                            {article.status === "rejected" &&
                                                article.rejection_note && (
                                                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
                                                        <strong>
                                                            Catatan Revisi dari
                                                            Leader:
                                                        </strong>{" "}
                                                        {article.rejection_note}
                                                    </div>
                                                )}

                                            {/* Panel Aksi Persetujuan Khusus Leader & Super Admin */}
                                            {canApprove &&
                                                article.status !==
                                                    "published" && (
                                                    <div className="mt-4 pt-3 border-t border-slate-200">
                                                        {rejectingId ===
                                                        article.id ? (
                                                            <div className="space-y-2">
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        rejectionNote
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setRejectionNote(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Tulis catatan revisi untuk peneliti..."
                                                                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-xs"
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRejectSubmit(
                                                                                article.id,
                                                                                rejectionNote,
                                                                                false,
                                                                            )
                                                                        }
                                                                        className="bg-red-700 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded cursor-pointer"
                                                                    >
                                                                        Kirim
                                                                        Catatan
                                                                        Revisi
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setRejectingId(
                                                                                null,
                                                                            );
                                                                            setRejectionNote(
                                                                                "",
                                                                            );
                                                                        }}
                                                                        className="text-xs text-slate-600 hover:underline cursor-pointer"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            article.id,
                                                                        )
                                                                    }
                                                                    className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-3.5 py-1.5 rounded transition cursor-pointer"
                                                                >
                                                                    Setujui
                                                                    &amp;
                                                                    Terbitkan
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setRejectingId(
                                                                            article.id,
                                                                        );
                                                                        setRejectionNote(
                                                                            article.rejection_note ||
                                                                                "",
                                                                        );
                                                                    }}
                                                                    className="bg-white hover:bg-red-50 text-red-700 border border-red-300 text-xs font-semibold px-3.5 py-1.5 rounded transition cursor-pointer"
                                                                >
                                                                    Tolak /
                                                                    Minta Revisi
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>

                                <div className="px-6 pb-6">
                                    <Pagination
                                        links={articles.links}
                                        from={articles.from}
                                        to={articles.to}
                                        total={articles.total}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Pratinjau Naskah untuk Leader / Super Admin */}
            {previewArticle && (
                <div className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-red-700 text-white">
                                    Pratinjau Naskah
                                </span>
                                <span className="text-xs text-slate-300">
                                    Status:{" "}
                                    <strong className="uppercase">
                                        {previewArticle.status === "published"
                                            ? "Tayang"
                                            : previewArticle.status ===
                                                "pending"
                                              ? "Menunggu Approval"
                                              : "Perlu Revisi"}
                                    </strong>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={closePreview}
                                className="text-slate-300 hover:text-white text-xl leading-none px-2 py-1 cursor-pointer"
                                title="Tutup Pratinjau"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Isi Pratinjau */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                                    <span>{previewArticle.category}</span>
                                    <span>&bull;</span>
                                    <span className="text-slate-500 font-medium normal-case">
                                        Penulis:{" "}
                                        <strong className="text-slate-800">
                                            {previewArticle.author}
                                        </strong>
                                    </span>
                                    <span>&bull;</span>
                                    <span className="text-slate-500 font-medium normal-case">
                                        {previewArticle.published_at.slice(
                                            0,
                                            16,
                                        )}{" "}
                                        WIB
                                    </span>
                                </div>

                                <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
                                    {previewArticle.title}
                                </h2>
                            </div>

                            {previewArticle.thumbnail && (
                                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                    <img
                                        src={`/storage/${previewArticle.thumbnail}`}
                                        alt={previewArticle.title}
                                        className="w-full max-h-80 object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Ringkasan / Temuan Utama
                                </p>
                                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                                    {previewArticle.excerpt}
                                </p>
                            </div>

                            {previewArticle.chart_data &&
                                previewArticle.chart_data.length > 0 && (
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                                        <SurveyChart
                                            title={
                                                previewArticle.chart_title ||
                                                "Hasil Data Survei"
                                            }
                                            sampleSize={
                                                previewArticle.sample_size ||
                                                undefined
                                            }
                                            data={previewArticle.chart_data}
                                        />
                                    </div>
                                )}

                            <div className="prose prose-slate max-w-none">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                                    Isi Laporan Riset / Analisis Lengkap
                                </p>
                                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {previewArticle.content}
                                </div>
                            </div>

                            {(previewArticle.source_name ||
                                previewArticle.external_link) && (
                                <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                                    {previewArticle.source_name && (
                                        <span>
                                            Sumber:{" "}
                                            <strong className="text-slate-700">
                                                {previewArticle.source_name}
                                            </strong>
                                        </span>
                                    )}
                                    {previewArticle.external_link && (
                                        <a
                                            href={previewArticle.external_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-red-700 hover:underline font-semibold"
                                        >
                                            Buka Tautan Eksternal &rarr;
                                        </a>
                                    )}
                                </div>
                            )}

                            {modalRejectMode && (
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
                                    <label className="block text-xs font-bold text-red-900">
                                        Catatan Revisi untuk Penulis *
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={modalRejectNote}
                                        onChange={(e) =>
                                            setModalRejectNote(e.target.value)
                                        }
                                        placeholder="Jelaskan bagian data, grafik, atau narasi yang perlu diperbaiki..."
                                        className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-xs text-slate-900"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRejectSubmit(
                                                    previewArticle.id,
                                                    modalRejectNote,
                                                    true,
                                                )
                                            }
                                            className="bg-red-700 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                                        >
                                            Kirim Catatan Revisi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setModalRejectMode(false)
                                            }
                                            className="text-xs font-semibold text-slate-600 hover:underline cursor-pointer"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Aksi Modal */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={closePreview}
                                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer"
                            >
                                Tutup Pratinjau
                            </button>

                            {canApprove &&
                                previewArticle.status !== "published" &&
                                !modalRejectMode && (
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setModalRejectMode(true)
                                            }
                                            className="px-4 py-2 rounded-lg border border-red-300 bg-white hover:bg-red-50 text-xs font-semibold text-red-700 cursor-pointer"
                                        >
                                            Tolak / Minta Revisi
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleApprove(previewArticle.id)
                                            }
                                            className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white cursor-pointer"
                                        >
                                            Setujui &amp; Terbitkan
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
