import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";

interface TrackRecord {
    id: number;
    title: string;
    year: string;
    partner: string | null;
    sample_info: string;
    accuracy_note: string;
    description: string;
}

interface TrackRecordsProps {
    trackRecords: TrackRecord[];
}

export default function TrackRecords({ trackRecords }: TrackRecordsProps) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: "",
        year: new Date().getFullYear().toString(),
        partner: "",
        sample_info: "",
        accuracy_note: "",
        description: "",
    });

    const resetForm = () => {
        setEditingId(null);
        reset();
    };

    const handleEdit = (record: TrackRecord) => {
        setEditingId(record.id);
        setData({
            title: record.title,
            year: record.year,
            partner: record.partner || "",
            sample_info: record.sample_info,
            accuracy_note: record.accuracy_note,
            description: record.description,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/admin/track-records/${editingId}`, {
                onSuccess: () => resetForm(),
            });
        } else {
            post("/admin/track-records", { onSuccess: () => resetForm() });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Hapus rekam jejak ini?")) {
            router.delete(`/admin/track-records/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Rekam Jejak — Admin Cyrus Network" />

            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Kelola Rekam Jejak &amp; Akurasi Hitung Cepat
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? "Edit Rekam Jejak"
                                    : "Tambah Rekam Jejak Baru"}
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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nama Kegiatan / Proyek Pemilu *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Misal: Quick Count Pemilihan Presiden 2024"
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Tahun *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.year}
                                        onChange={(e) =>
                                            setData("year", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Mitra Kolaborasi (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.partner}
                                        onChange={(e) =>
                                            setData("partner", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="Misal: CSIS Indonesia"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Cakupan Sampel *
                                </label>
                                <input
                                    type="text"
                                    value={data.sample_info}
                                    onChange={(e) =>
                                        setData("sample_info", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Misal: 2.000 TPS di 38 Provinsi"
                                />
                                {errors.sample_info && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.sample_info}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Catatan Akurasi / Selisih *
                                </label>
                                <input
                                    type="text"
                                    value={data.accuracy_note}
                                    onChange={(e) =>
                                        setData("accuracy_note", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Misal: Selisih 0,25% dari Rekapitulasi Resmi KPU"
                                />
                                {errors.accuracy_note && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.accuracy_note}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Deskripsi Metodologi &amp; Hasil *
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded transition cursor-pointer"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : editingId
                                      ? "Simpan Perubahan"
                                      : "Tambah Rekam Jejak"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm divide-y divide-slate-200">
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Daftar Rekam Jejak ({trackRecords.length})
                            </h2>
                        </div>

                        {trackRecords.map((record) => (
                            <div
                                key={record.id}
                                className="p-6 flex items-start justify-between gap-4"
                            >
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                                        <span className="font-bold text-red-700">
                                            {record.year}
                                        </span>
                                        {record.partner && (
                                            <span className="text-slate-500">
                                                &bull; Mitra: {record.partner}
                                            </span>
                                        )}
                                        <span className="text-emerald-700 font-semibold">
                                            &bull; {record.accuracy_note}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-900">
                                        {record.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        {record.description}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Sampel: {record.sample_info}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => handleEdit(record)}
                                        className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
