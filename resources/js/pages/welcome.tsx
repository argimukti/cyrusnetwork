import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
            <Head title="Cyrus Network" />
            <div className="max-w-md w-full bg-white text-slate-900 rounded-2xl p-8 text-center shadow-xl">
                <img
                    src="/images/logo-cyrus.png"
                    alt="Cyrus Network"
                    className="h-10 w-auto mx-auto mb-4 object-contain"
                />
                <h1 className="text-xl font-extrabold">Cyrus Network</h1>
                <p className="text-xs text-slate-600 mt-1 mb-6">
                    Portal Riset Opini Publik &amp; Konsultan Politik
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-red-700 hover:bg-red-600 transition"
                    >
                        Buka Beranda Website
                    </Link>
                    <Link
                        href="/login"
                        className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
                    >
                        Masuk Portal Internal
                    </Link>
                </div>
            </div>
        </div>
    );
}
