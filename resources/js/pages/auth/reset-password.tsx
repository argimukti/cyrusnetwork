import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email || "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/reset-password", {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Buat Password Baru — Portal Internal Cyrus Network" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="inline-flex flex-col items-center">
                    <div className="bg-white px-4 py-2.5 rounded-xl shadow-md mb-4">
                        <img
                            src="/images/logo-cyrus.png"
                            alt="Cyrus Network"
                            className="h-10 w-auto object-contain"
                        />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Portal Internal &amp; Redaksi Riset
                    </span>
                </Link>
                <h1 className="mt-2 text-2xl font-extrabold text-white tracking-tight">
                    Atur Password Baru
                </h1>
                <p className="mt-1.5 text-xs text-slate-400">
                    Masukkan kombinasi password baru minimal 8 karakter untuk
                    akun Anda.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-slate-200 sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                            >
                                Email Akun
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoComplete="username"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-700"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                            >
                                Password Baru
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                autoFocus
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="Minimal 8 karakter"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-700"
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                            >
                                Konfirmasi Password Baru
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                placeholder="Ulangi password baru"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-700"
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-xs text-sm font-bold text-white bg-red-700 hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
                        >
                            {processing
                                ? "Menyimpan..."
                                : "Simpan Password Baru"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
