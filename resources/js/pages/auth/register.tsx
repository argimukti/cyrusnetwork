import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function RegisterDisabled() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Pendaftaran Ditutup — Portal Internal Cyrus Network" />

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
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-slate-200 sm:px-10 text-center">
                    <h1 className="text-xl font-extrabold text-slate-900">
                        Pendaftaran Akun Publik Dinonaktifkan
                    </h1>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        Pembuatan akun internal Cyrus Network hanya dilakukan
                        oleh <strong>Super Admin</strong> melalui menu Kelola
                        Akun.
                    </p>

                    <div className="mt-6 flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-600 transition"
                        >
                            Ke Halaman Login
                        </Link>
                        <Link
                            href="/"
                            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                        >
                            &larr; Kembali ke Beranda Website
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
