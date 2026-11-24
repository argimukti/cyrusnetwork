import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import SurveyChart, { ChartItem } from "@/components/SurveyChart";

interface Service {
    id: number;
    title: string;
    slug: string;
    summary: string;
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

interface Article {
    id: number;
    title: string;
    author?: string;
    slug: string;
    category: string;
    source_name: string | null;
    external_link: string | null;
    excerpt: string;
    published_at: string;
    chart_title?: string | null;
    sample_size?: string | null;
    chart_data?: ChartItem[] | null;
}

interface Leader {
    id: number;
    name: string;
    position: string;
    bio: string;
    photo?: string | null;
}

interface HomeProps {
    services: Service[];
    trackRecords: TrackRecord[];
    articles: Article[];
    leaders: Leader[];
    featuredSurvey: Article | null;
}

export default function Home({
    services,
    trackRecords,
    articles,
    leaders,
    featuredSurvey,
}: HomeProps) {
    return (
        <MainLayout>
            <Head title="Beranda — Cyrus Network" />

            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20 lg:py-28 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="inline-block px-3 py-1 rounded bg-red-700/20 border border-red-600/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-5">
                            Berdiri Sejak 2010 &bull; Jakarta Selatan
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            Presisi Data Riset &amp; Strategi Komunikasi Politik
                            Nasional
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed mb-8">
                            Cyrus Network membantu pemangku kepentingan membaca
                            lanskap opini publik, merumuskan kebijakan berbasis
                            data, serta merancang strategi kampanye yang
                            terukur.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/layanan"
                                className="bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded transition"
                            >
                                Jelajahi Layanan
                            </Link>
                            <Link
                                href="/tentang-kami"
                                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded border border-slate-700 transition"
                            >
                                Profil Lembaga
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Metrics / Quick Count Highlight */}
            <section className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        <div className="pt-4 md:pt-0 md:px-6 first:pl-0">
                            <p className="text-3xl font-extrabold text-slate-900">
                                15+ Tahun
                            </p>
                            <p className="text-sm font-semibold text-red-700 mt-1">
                                Pengalaman Strategis
                            </p>
                            <p className="text-sm text-slate-600 mt-2">
                                Didirikan oleh Hasan Nasbi pada tahun 2010
                                sebagai mitra riset dan konsultasi politik.
                            </p>
                        </div>
                        <div className="pt-4 md:pt-0 md:px-6">
                            <p className="text-3xl font-extrabold text-slate-900">
                                2.000 TPS
                            </p>
                            <p className="text-sm font-semibold text-red-700 mt-1">
                                Cakupan 38 Provinsi
                            </p>
                            <p className="text-sm text-slate-600 mt-2">
                                Sampel nasional Quick Count Pilpres 2024
                                berkolaborasi bersama CSIS Indonesia.
                            </p>
                        </div>
                        <div className="pt-4 md:pt-0 md:px-6">
                            <p className="text-3xl font-extrabold text-slate-900">
                                0,25%
                            </p>
                            <p className="text-sm font-semibold text-red-700 mt-1">
                                Margin Selisih Hasil KPU
                            </p>
                            <p className="text-sm text-slate-600 mt-2">
                                Tingkat presisi tinggi dalam proyeksi hitung
                                cepat dibandingkan rekapitulasi resmi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layanan Utama */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-red-700">
                                Bidang Fokus
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 mt-2">
                                Layanan Konsultasi &amp; Riset
                            </h2>
                        </div>
                        <Link
                            href="/layanan"
                            className="text-sm font-semibold text-red-700 hover:underline mt-4 md:mt-0"
                        >
                            Lihat detail semua layanan &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition"
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {service.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rekam Jejak Pemilu */}
            {trackRecords.length > 0 && (
                <section className="bg-slate-900 text-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                            Rekam Jejak Teruji
                        </span>
                        <h2 className="text-3xl font-bold mt-2 mb-8">
                            Akurasi Hitung Cepat &amp; Survei Nasional
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {trackRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="bg-slate-800/70 border border-slate-700 rounded-lg p-8"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                        <div>
                                            <span className="text-xs font-semibold bg-red-700 text-white px-2.5 py-1 rounded">
                                                Tahun {record.year}
                                            </span>
                                            {record.partner && (
                                                <span className="ml-3 text-sm text-slate-300">
                                                    Mitra:{" "}
                                                    <strong>
                                                        {record.partner}
                                                    </strong>
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-emerald-400">
                                            {record.accuracy_note}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">
                                        {record.title}
                                    </h3>
                                    <p className="text-sm text-slate-300 mb-4">
                                        {record.description}
                                    </p>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                                        Metodologi &amp; Sampel:{" "}
                                        {record.sample_info}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Sorotan Grafik Survei Terbaru */}
            {featuredSurvey &&
                featuredSurvey.chart_data &&
                featuredSurvey.chart_data.length > 0 && (
                    <section className="py-16 bg-slate-100 border-b border-slate-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-5">
                                <span className="text-xs font-bold uppercase tracking-widest text-red-700">
                                    Rilis Survei Terbaru
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3">
                                    {featuredSurvey.title}
                                </h2>
                                <p className="text-xs text-slate-500 mb-4">
                                    Penulis:{" "}
                                    <strong>
                                        {featuredSurvey.author ||
                                            "Tim Riset Cyrus Network"}
                                    </strong>{" "}
                                    &bull;{" "}
                                    {featuredSurvey.published_at.slice(0, 16)}{" "}
                                    WIB
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                    {featuredSurvey.excerpt}
                                </p>
                                <Link
                                    href={`/publikasi/${featuredSurvey.slug}`}
                                    className="inline-block bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded transition"
                                >
                                    Baca Laporan Lengkap &rarr;
                                </Link>
                            </div>

                            <div className="lg:col-span-7">
                                <SurveyChart
                                    title={featuredSurvey.chart_title}
                                    sampleSize={featuredSurvey.sample_size}
                                    data={featuredSurvey.chart_data}
                                />
                            </div>
                        </div>
                    </section>
                )}

            {/* Kepemimpinan */}
            <section className="py-16 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-700">
                        Struktur Kepemimpinan
                    </span>
                    <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-10">
                        Pendiri &amp; Jajaran Eksekutif
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {leaders.map((leader) => (
                            <div
                                key={leader.id}
                                className="p-6 rounded-lg bg-slate-50 border border-slate-200"
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

            {/* Publikasi & Sorotan Politik */}
            <section className="py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-red-700">
                                Rilis &amp; Liputan Media
                            </span>
                            <h2 className="text-3xl font-bold text-slate-900 mt-2">
                                Analisis &amp; Sorotan Terkini
                            </h2>
                        </div>
                        <Link
                            href="/publikasi"
                            className="text-sm font-semibold text-red-700 hover:underline mt-4 md:mt-0"
                        >
                            Semua publikasi &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((article) => (
                            <article
                                key={article.id}
                                className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between shadow-sm"
                            >
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                                        <span className="font-semibold text-red-700 uppercase">
                                            {article.category}
                                        </span>
                                        {article.author && (
                                            <>
                                                <span>&bull;</span>
                                                <span>{article.author}</span>
                                            </>
                                        )}
                                        <span>&bull;</span>
                                        <span>
                                            {article.published_at.slice(0, 16)}{" "}
                                            WIB
                                        </span>
                                    </div>
                                    <Link href={`/publikasi/${article.slug}`}>
                                        <h3 className="text-xl font-bold text-slate-900 hover:text-red-700 transition mb-3">
                                            {article.title}
                                        </h3>
                                    </Link>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                        {article.excerpt}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={`/publikasi/${article.slug}`}
                                        className="text-sm font-semibold text-slate-900 hover:text-red-700 transition"
                                    >
                                        Baca selengkapnya &rarr;
                                    </Link>
                                    {article.external_link && (
                                        <a
                                            href={article.external_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                                        >
                                            (
                                            {article.source_name ||
                                                "Sumber Media"}{" "}
                                            &nearr;)
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
