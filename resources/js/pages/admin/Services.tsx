import React, { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";

interface Service {
    id: number;
    title: string;
    summary: string;
    description: string;
    sort_order: number;
}

interface ServicesProps {
    services: Service[];
}

export default function Services({ services }: ServicesProps) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: "",
        summary: "",
        description: "",
        sort_order: services.length + 1,
    });

    const resetForm = () => {
        setEditingId(null);
        reset();
        setData("sort_order", services.length + 1);
    };

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setData({
            title: service.title,
            summary: service.summary,
            description: service.description,
            sort_order: service.sort_order,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/admin/services/${editingId}`, {
                onSuccess: () => resetForm(),
            });
        } else {
            post("/admin/services", { onSuccess: () => resetForm() });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Hapus layanan ini?")) {
            router.delete(`/admin/services/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Layanan — Admin Cyrus Network" />

            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Kelola Layanan Konsultasi &amp; Riset
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? "Edit Layanan"
                                    : "Tambah Layanan Baru"}
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
                            <div className="grid grid-cols-4 gap-3">
                                <div className="col-span-3">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Nama Layanan *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="Misal: Riset Opini Publik"
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Urutan *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData(
                                                "sort_order",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Ringkasan Singkat (Tampil di Beranda) *
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.summary}
                                    onChange={(e) =>
                                        setData("summary", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                />
                                {errors.summary && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.summary}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Penjelasan Lengkap (Tampil di Halaman
                                    Layanan) *
                                </label>
                                <textarea
                                    rows={4}
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
                                      : "Tambah Layanan"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm divide-y divide-slate-200">
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Daftar Layanan Aktif ({services.length})
                            </h2>
                        </div>

                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="p-6 flex items-start justify-between gap-4"
                            >
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-red-700">
                                            #{service.sort_order}
                                        </span>
                                        <h3 className="font-bold text-slate-900">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 mt-1">
                                        {service.summary}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {service.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
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
