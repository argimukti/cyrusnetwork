import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";

interface Leader {
    id: number;
    name: string;
    position: string;
    bio: string;
    photo?: string | null;
}

interface TrackRecord {
    id: number;
    title: string;
    year: string;
    partner: string | null;
    sample_info: string;
    accuracy_note: string;
    description: string;
}

interface AboutProps {
    leaders: Leader[];
    trackRecords: TrackRecord[];
}

export default function About({ leaders, trackRecords }: AboutProps) {
    return (
        <MainLayout>
            <Head title="Tentang Kami — Cyrus Network" />

            {/* Header */}
            <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Profil Lembaga
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
                        Tentang Cyrus Network
                    </h1>
                    <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                        Lembaga konsultan politik, riset opini publik, dan
                        komunikasi strategis yang berbasis di Jakarta Selatan
                        sejak tahun 2010.
                    </p>
                </div>
            </section>

            {/* Sejarah & Fokus */}
            <section className="py-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Sejarah &amp; Dedikasi Riset
                        </h2>
                        <div className="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                            <p>
                                Didirikan pada tahun <strong>2010</strong> oleh{" "}
                                <strong>Hasan Nasbi</strong> di Jakarta Selatan,
                                Cyrus Network hadir untuk menjawab kebutuhan
                                pengambilan keputusan politik dan kebijakan
                                publik berbasis data empiris.
                            </p>
                            <p>
                                Selama lebih dari satu dekade, lembaga ini
                                memadukan ketajaman metodologi survei
                                kuantitatif dengan pembacaan lanskap media serta
                                strategi komunikasi yang terukur bagi tokoh
                                publik, institusi negara, maupun korporasi.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            Pilar Utama Keahlian
                        </h3>
                        <ul className="space-y-3 text-sm text-slate-700">
                            <li className="flex items-start gap-3">
                                <span className="text-red-700 font-bold">
                                    &bull;
                                </span>
                                <span>
                                    <strong>Konsultasi Politik:</strong>{" "}
                                    Pemetaan elektoral, positioning kandidat,
                                    dan perumusan strategi pemenangan.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-700 font-bold">
                                    &bull;
                                </span>
                                <span>
                                    <strong>
                                        Riset Opini Publik &amp; Quick Count:
                                    </strong>{" "}
                                    Survei probabilistik nasional/daerah dan
                                    hitung cepat presisi tinggi.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-700 font-bold">
                                    &bull;
                                </span>
                                <span>
                                    <strong>
                                        Kebijakan Publik &amp; Government
                                        Relations:
                                    </strong>{" "}
                                    Analisis regulasi dan jembatan komunikasi
                                    antar-pemangku kepentingan.
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-red-700 font-bold">
                                    &bull;
                                </span>
                                <span>
                                    <strong>Analisis Lanskap Media:</strong>{" "}
                                    Pemantauan sentimen publik dan manajemen
                                    komunikasi digital.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Jajaran Pimpinan */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">
                        Pendiri &amp; Kepemimpinan
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {leaders.map((leader) => (
                            <div
                                key={leader.id}
                                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm"
                            >
                                {leader.photo ? (
                                    <img
                                        src={`/storage/${leader.photo}`}
                                        alt={leader.name}
                                        className="w-16 h-16 rounded-full object-cover border border-slate-200 mb-4"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl mb-4">
                                        {leader.name.charAt(0)}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-slate-900">
                                    {leader.name}
                                </h3>
                                <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mt-1 mb-3">
                                    {leader.position}
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {leader.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rekam Jejak */}
            {trackRecords.length > 0 && (
                <section className="py-16 bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold mb-6">
                            Rekam Jejak Pemilu
                        </h2>
                        <div className="space-y-6">
                            {trackRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="bg-slate-800 border border-slate-700 p-6 rounded-lg"
                                >
                                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase text-red-400">
                                            {record.year}{" "}
                                            {record.partner
                                                ? `• Mitra: ${record.partner}`
                                                : ""}
                                        </span>
                                        <span className="text-xs font-semibold text-emerald-400">
                                            {record.accuracy_note}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {record.title}
                                    </h3>
                                    <p className="text-sm text-slate-300 mb-3">
                                        {record.description}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Sampel: {record.sample_info}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10">
                            <Link
                                href="/kontak"
                                className="inline-block bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded transition"
                            >
                                Diskusikan Kebutuhan Riset Anda
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
