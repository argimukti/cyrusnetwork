import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";

interface Service {
    id: number;
    title: string;
    slug: string;
    summary: string;
    description: string;
}

interface ServicesProps {
    services: Service[];
}

export default function Services({ services }: ServicesProps) {
    return (
        <MainLayout>
            <Head title="Layanan — Cyrus Network" />

            <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Solusi Strategis
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
                        Layanan Konsultasi &amp; Riset
                    </h1>
                    <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                        Pendekatan berbasis bukti (evidence-based) untuk
                        membantu klien memahami dinamika pemilih, kebijakan
                        publik, dan lanskap opini media.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {services.map((service, index) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                        >
                            <div className="lg:col-span-4">
                                <span className="inline-block text-xs font-bold text-red-700 uppercase tracking-widest mb-2">
                                    Layanan 0{index + 1}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {service.title}
                                </h2>
                            </div>
                            <div className="lg:col-span-8 space-y-3">
                                <p className="text-base font-medium text-slate-800">
                                    {service.summary}
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="bg-slate-900 text-white rounded-lg p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold">
                                Butuh proposal riset atau pendampingan
                                strategis?
                            </h3>
                            <p className="text-sm text-slate-300 mt-1">
                                Tim konsultan kami siap merancang metodologi
                                yang sesuai dengan kebutuhan institusi Anda.
                            </p>
                        </div>
                        <Link
                            href="/kontak"
                            className="bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded transition shrink-0"
                        >
                            Hubungi Tim Kami
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
