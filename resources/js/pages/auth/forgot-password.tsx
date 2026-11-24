import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { props } = usePage<{
        status?: string;
        flash?: { status?: string; success?: string };
    }>();

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            email: "",
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/forgot-password", {
            preserveScroll: true,
        });
    };

    const statusMessage =
        status ||
        props.status ||
        props.flash?.status ||
        props.flash?.success ||
        (recentlySuccessful
            ? "Tautan reset password telah dikirim ke alamat email terdaftar. Silakan periksa kotak masuk atau folder spam Anda."
            : null);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Lupa Password — Portal Internal Cyrus Network" />

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
                        Pemulihan Akses Portal Internal
                    </span>
                </Link>
                <h1 className="mt-2 text-2xl font-extrabold text-white tracking-tight">
                    Reset Password via Email
                </h1>
                <p className="mt-1.5 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Masukkan alamat email akun yang terdaftar. Sistem akan
                    mengirimkan tautan untuk membuat password baru.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-slate-200 sm:px-10">
                    {statusMessage && (
                        <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 leading-relaxed">
                            {statusMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                            >
                                Email Akun Terdaftar
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-xs text-sm font-bold text-white bg-red-700 hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
                        >
                            {processing
                                ? "Mengirim Tautan..."
                                : "Kirim Tautan Reset Password"}
                        </button>
                    </form>

                    <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                        <strong>Catatan:</strong> Jika email tidak masuk dalam
                        beberapa menit atau Anda tidak memiliki akses ke kotak
                        masuk email tersebut, silakan hubungi{" "}
                        <strong>Super Admin</strong> untuk reset manual.
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                        <Link
                            href="/login"
                            className="text-xs font-semibold text-slate-600 hover:text-red-700 transition"
                        >
                            &larr; Kembali ke Halaman Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
