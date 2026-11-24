import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Login Portal Internal — Cyrus Network" />

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
                    Masuk ke Sistem Cyrus Network
                </h1>
                <p className="mt-1.5 text-xs text-slate-400">
                    Akses terbatas hanya untuk Pimpinan, Tim Riset, dan Staf
                    Internal.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-slate-200 sm:px-10">
                    {status && (
                        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
                            {status}
                        </div>
                    )}

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
                                autoFocus
                                autoComplete="username"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="nama@cyrusnetwork.id"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-700"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                                >
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-red-700 hover:underline"
                                >
                                    Lupa password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-700 focus:outline-none focus:ring-1 focus:ring-red-700"
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-xs font-medium text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="inline-flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="rounded border-slate-300 text-red-700 focus:ring-red-700"
                                />
                                <span className="text-xs text-slate-600">
                                    Ingat sesi login saya
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-xs text-sm font-bold text-white bg-red-700 hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
                        >
                            {processing
                                ? "Memverifikasi..."
                                : "Masuk ke Portal"}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                        <Link
                            href="/"
                            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                        >
                            &larr; Kembali ke Beranda Website Publik
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
