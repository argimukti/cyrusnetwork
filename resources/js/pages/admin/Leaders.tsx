import React, { useRef, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";

interface Leader {
    id: number;
    name: string;
    position: string;
    bio: string;
    photo: string | null;
    sort_order: number;
}

interface LeadersProps {
    leaders: Leader[];
}

export default function Leaders({ leaders }: LeadersProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        position: string;
        bio: string;
        photo: File | null;
        sort_order: number;
    }>({
        name: "",
        position: "",
        bio: "",
        photo: null,
        sort_order: leaders.length + 1,
    });

    const resetForm = () => {
        setEditingId(null);
        reset();
        setData("sort_order", leaders.length + 1);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEdit = (leader: Leader) => {
        setEditingId(leader.id);
        setData({
            name: leader.name,
            position: leader.position,
            bio: leader.bio,
            photo: null,
            sort_order: leader.sort_order,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            router.post(
                `/admin/leaders/${editingId}`,
                {
                    _method: "put",
                    ...data,
                },
                {
                    forceFormData: true,
                    onSuccess: () => resetForm(),
                },
            );
        } else {
            post("/admin/leaders", {
                forceFormData: true,
                onSuccess: () => resetForm(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus profil pimpinan ini?")) {
            router.delete(`/admin/leaders/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pimpinan — Admin Cyrus Network" />

            <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Kelola Pendiri &amp; Jajaran Pimpinan
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                {editingId
                                    ? "Edit Profil Pimpinan"
                                    : "Tambah Pimpinan Baru"}
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
                                    Nama Lengkap &amp; Gelar *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Misal: Hafizhul Mizan Piliang"
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Jabatan *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.position}
                                        onChange={(e) =>
                                            setData("position", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                        placeholder="Misal: Direktur Eksekutif"
                                    />
                                    {errors.position && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.position}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Urutan Tampil *
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
                                    Foto Profil (Opsional, Maks 2MB)
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            "photo",
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700"
                                />
                                {errors.photo && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.photo}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Profil Singkat / Biografi *
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.bio}
                                    onChange={(e) =>
                                        setData("bio", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Uraikan peran dan rekam jejak..."
                                />
                                {errors.bio && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.bio}
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
                                      : "Tambah Pimpinan"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Daftar Pimpinan */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm divide-y divide-slate-200">
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Daftar Pimpinan ({leaders.length})
                            </h2>
                        </div>

                        {leaders.map((leader) => (
                            <div
                                key={leader.id}
                                className="p-6 flex items-start justify-between gap-4"
                            >
                                <div className="flex items-start gap-4">
                                    {leader.photo ? (
                                        <img
                                            src={`/storage/${leader.photo}`}
                                            alt={leader.name}
                                            className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                            {leader.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">
                                                {leader.name}
                                            </h3>
                                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                Urutan #{leader.sort_order}
                                            </span>
                                        </div>
                                        <p className="text-xs font-semibold text-red-700 uppercase mt-0.5">
                                            {leader.position}
                                        </p>
                                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                            {leader.bio}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button
                                        onClick={() => handleEdit(leader)}
                                        className="text-xs font-semibold text-slate-700 hover:underline cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(leader.id)}
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
