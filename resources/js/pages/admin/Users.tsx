import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import Pagination, { PaginatedData } from "@/components/Pagination";

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    must_change_password?: boolean;
}

interface UsersProps {
    users: PaginatedData<UserItem>;
    filters: {
        search: string;
    };
}

export default function Users({ users, filters }: UsersProps) {
    const { props } = usePage<{ auth?: { user?: { id: number } } }>();
    const currentUserId = props.auth?.user?.id;

    const [search, setSearch] = useState<string>(filters.search || "");
    const [resettingUserId, setResettingUserId] = useState<number | null>(null);
    const [newPassword, setNewPassword] = useState<string>("");
    const [showNewPassword, setShowNewPassword] = useState<boolean>(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        role: "peneliti",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/users", {
            onSuccess: () => reset(),
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/users",
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        router.patch(
            `/admin/users/${userId}/role`,
            { role: newRole },
            { preserveScroll: true },
        );
    };

    const handleResetPasswordSubmit = (userId: number) => {
        if (newPassword.trim().length < 6) {
            alert("Password baru minimal 6 karakter.");
            return;
        }

        router.patch(
            `/admin/users/${userId}/password`,
            { password: newPassword },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setResettingUserId(null);
                    setNewPassword("");
                },
            },
        );
    };

    const handleDelete = (userId: number) => {
        if (confirm("Hapus akun pengguna ini?")) {
            router.delete(`/admin/users/${userId}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Akun & Level — Super Admin" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Kelola Akun, Level Akses &amp; Reset Password
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                    Buat akun internal baru, atur kewenangan level, atau bantu
                    reset password staf yang lupa.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Tambah Akun */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">
                            Tambah Akun Baru
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Nama staf / pimpinan"
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Email Login *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="nama@cyrusnetwork.id"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Password Awal *
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                    placeholder="Minimal 6 karakter"
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Level Akses *
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-white"
                                >
                                    <option value="admin">
                                        Super Admin (Semua Menu + Kelola Akun)
                                    </option>
                                    <option value="leader">
                                        Leader / Pimpinan (Approval Publikasi)
                                    </option>
                                    <option value="peneliti">
                                        Tim Riset (Ajukan Naskah Survei &amp;
                                        Artikel)
                                    </option>
                                    <option value="humas">
                                        Humas &amp; Ops (Pesan, Pimpinan,
                                        Layanan, Rekam Jejak)
                                    </option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm py-2.5 rounded-lg transition cursor-pointer"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : "Buat Akun Pengguna"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Daftar Akun */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 space-y-3">
                            <h2 className="text-lg font-bold text-slate-900">
                                Daftar Akun Terdaftar ({users.total})
                            </h2>

                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama atau email staf..."
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

                        {users.data.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500">
                                Tidak ada akun yang cocok dengan pencarian Anda.
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-slate-200">
                                    {users.data.map((user) => (
                                        <div key={user.id} className="p-6">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-bold text-slate-900">
                                                            {user.name}
                                                        </p>
                                                        {user.must_change_password && (
                                                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                                                Wajib Ganti
                                                                Password
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3">
                                                    <select
                                                        value={user.role}
                                                        disabled={
                                                            user.id ===
                                                            currentUserId
                                                        }
                                                        onChange={(e) =>
                                                            handleRoleChange(
                                                                user.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="rounded border border-slate-300 px-2.5 py-1.5 text-xs bg-white disabled:bg-slate-100"
                                                    >
                                                        <option value="admin">
                                                            Super Admin
                                                        </option>
                                                        <option value="leader">
                                                            Leader / Pimpinan
                                                        </option>
                                                        <option value="peneliti">
                                                            Tim Riset
                                                        </option>
                                                        <option value="humas">
                                                            Humas &amp; Ops
                                                        </option>
                                                    </select>

                                                    {user.id !==
                                                        currentUserId && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setResettingUserId(
                                                                        resettingUserId ===
                                                                            user.id
                                                                            ? null
                                                                            : user.id,
                                                                    );
                                                                    setNewPassword(
                                                                        "",
                                                                    );
                                                                }}
                                                                className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                                                            >
                                                                Reset Password
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id,
                                                                    )
                                                                }
                                                                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Panel Inline Reset Password */}
                                            {resettingUserId === user.id && (
                                                <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3">
                                                    <p className="text-xs font-bold text-amber-900">
                                                        Atur Password Baru untuk{" "}
                                                        {user.name}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                                        <input
                                                            type={
                                                                showNewPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            value={newPassword}
                                                            onChange={(e) =>
                                                                setNewPassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Masukkan password sementara (min. 6 karakter)"
                                                            className="grow rounded border border-slate-300 bg-white px-3 py-1.5 text-xs"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowNewPassword(
                                                                    !showNewPassword,
                                                                )
                                                            }
                                                            className="text-xs font-semibold text-slate-600 bg-white border border-slate-300 px-2.5 py-1.5 rounded hover:bg-slate-50 cursor-pointer"
                                                        >
                                                            {showNewPassword
                                                                ? "Sembunyikan"
                                                                : "Tampilkan"}
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleResetPasswordSubmit(
                                                                    user.id,
                                                                )
                                                            }
                                                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded cursor-pointer"
                                                        >
                                                            Simpan Password Baru
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setResettingUserId(
                                                                    null,
                                                                );
                                                                setNewPassword(
                                                                    "",
                                                                );
                                                            }}
                                                            className="text-xs text-slate-600 hover:underline cursor-pointer"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="px-6 pb-6">
                                    <Pagination
                                        links={users.links}
                                        from={users.from}
                                        to={users.to}
                                        total={users.total}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
