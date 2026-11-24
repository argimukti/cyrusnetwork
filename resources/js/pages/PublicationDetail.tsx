import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import SurveyChart, { ChartItem } from "@/components/SurveyChart";
import { formatTanggalJam } from "./Publications";

interface Article {
id: number;
title: string;
slug: string;
author: string;
category: string;
source_name: string | null;
external_link: string | null;
thumbnail: string | null;
chart_title: string | null;
sample_size: string | null;
chart_data: ChartItem[] | null;
excerpt: string;
content: string;
published_at: string;
}

interface SeoMeta {
title?: string;
description?: string;
image?: string;
url?: string;
}

interface PublicationDetailProps {
article: Article;
seo?: SeoMeta;
}

export default function PublicationDetail({
article,
seo,
}: PublicationDetailProps) {
const pageTitle = seo?.title || `${article.title} — Cyrus Network`;
const pageDescription = seo?.description || article.excerpt;
const pageImage =
seo?.image ||
(article.thumbnail
? `/storage/${article.thumbnail}`
: "/images/logo-cyrus.png");

return (
<MainLayout>

    <Head title={pageTitle}>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        {seo?.url &&
        <meta property="og:url" content={seo.url} />}
        <meta name="twitter:card" content="summary_large_image" />
    </Head>

    <article className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
                <Link href="/publikasi"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-700 transition">
                &larr; Kembali ke Daftar Publikasi &amp; Riset
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-6 sm:p-10 border-b border-slate-100">
                    <div
                        className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 mb-3">
                        <span>{article.category}</span>
                        {article.source_name && (
                        <>
                            <span className="text-slate-300">
                                &bull;
                            </span>
                            <span className="text-slate-600 font-semibold normal-case">
                                Sumber: {article.source_name}
                            </span>
                        </>
                        )}
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                        {article.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
                        <span>
                            Penulis:{" "}
                            <strong className="text-slate-800">
                                {article.author}
                            </strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                            {formatTanggalJam(article.published_at)}
                        </span>
                    </div>
                </div>

                {article.thumbnail && (
                <div className="bg-slate-100 border-b border-slate-200">
                    <img src={`/storage/${article.thumbnail}`} alt={article.title}
                        className="w-full max-h-115 object-cover" />
                </div>
                )}

                <div className="p-6 sm:p-10 space-y-8">
                    <div className="p-5 rounded-xl bg-slate-50 border-l-4 border-red-700">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-red-700 mb-1.5">
                            Ringkasan &amp; Temuan Utama
                        </p>
                        <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                            {article.excerpt}
                        </p>
                    </div>

                    {article.chart_data &&
                    article.chart_data.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-white shadow-2xs">
                        <SurveyChart title={ article.chart_title || "Hasil Data Survei" } sampleSize={
                            article.sample_size || undefined } data={article.chart_data} />
                    </div>
                    )}

                    <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {article.content}
                    </div>

                    {article.external_link && (
                    <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs text-slate-500">
                            Referensi / Liputan eksternal terkait
                            publikasi ini:
                        </span>
                        <a href={article.external_link} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition">
                            Buka Tautan Eksternal &rarr;
                        </a>
                    </div>
                    )}
                </div>
            </div>
        </div>
    </article>
</MainLayout>
);
}
