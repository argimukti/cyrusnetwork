import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";

const ROLE_NAMES: Record<string, string> = {
    admin: "Super Admin",
    leader: "Leader / Pimpinan",
    peneliti: "Tim Riset",
    humas: "Humas & Operasional",
};

export default function Profile() {
    const { props } = usePage<{
        auth?: {
            user?: {
                name: string;
                email: string;
                role?: string;
                must_change_password?: boolean;
            };
        };
    }>();

    const user = props.auth?.user;

    const profileForm = useForm({
        name: user?.name || "",
        email: user?.email || "",
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch("/admin/profile", {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put("/admin/profile/password", {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Profil & Ubah Password — Portal Internal Cyrus Network" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Pengaturan Profil &amp; Keamanan Akun
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                    Perbarui identitas akun atau ganti password login Anda
                    secara mandiri.
                </p>
            </div>

            {user?.must_change_password && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-sm">
                    <p className="font-bold">
                        Wajib Mengganti Password Sementara
                    </p>
                    <p className="text-xs mt-1 leading-relaxed">
                        Akun Anda saat ini menggunakan password awal/sementara
                        dari Super Admin. Silakan isi formulir{" "}
                        <strong>Ubah Password</strong> di bawah ini dengan
                        password pribadi minimal 8 karakter untuk membuka
                        kembali akses ke Dashboard dan menu lainnya.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Informasi Profil */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        Informasi Akun
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                        Level Akses Anda:{" "}
                        <strong className="text-slate-800">
                            {ROLE_NAMES[user?.role || ""] || user?.role}
                        </strong>
                    </p>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Nama Lengkap *
                            </label>
                            <input
                                type="text"
                                value={profileForm.data.name}
                                onChange={(e) =>
                                    profileForm.setData("name", e.target.value)
                                }
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            />
                            {profileForm.errors.name && (
                                <p className="text-xs text-red-600 mt-1">
                                    {profileForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Alamat Email Login *
                            </label>
                            <input
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) =>
                                    profileForm.setData("email", e.target.value)
                                }
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            />
                            {profileForm.errors.email && (
                                <p className="text-xs text-red-600 mt-1">
                                    {profileForm.errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={profileForm.processing}
                            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition cursor-pointer"
                        >
                            {profileForm.processing
                                ? "Menyimpan..."
                                : "Simpan Profil"}
                        </button>
                    </form>
                </div>

                {/* Form Ubah Password */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        Ubah Password
                    </h2>
                    <p className="text-xs text-slate-500 mb-5">
                        Gunakan kombinasi minimal 8 karakter untuk menjaga
                        keamanan akses portal.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Password Saat Ini *
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "current_password",
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Masukkan password lama / sementara"
                            />
                            {passwordForm.errors.current_password && (
                                <p className="text-xs text-red-600 mt-1">
                                    {passwordForm.errors.current_password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Password Baru *
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "password",
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Minimal 8 karakter"
                            />
                            {passwordForm.errors.password && (
                                <p className="text-xs text-red-600 mt-1">
                                    {passwordForm.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Konfirmasi Password Baru *
                            </label>
                            <input
                                type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) =>
                                    passwordForm.setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Ulangi password baru"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordForm.processing}
                            className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition cursor-pointer"
                        >
                            {passwordForm.processing
                                ? "Memperbarui..."
                                : "Perbarui Password"}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
