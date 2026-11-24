import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";

interface ServiceOption {
    id: number;
    title: string;
}

interface ContactProps {
    services: ServiceOption[];
}

export default function Contact({ services }: ContactProps) {
    const { props } = usePage<{ flash?: { success?: string } }>();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        institution: "",
        email: "",
        phone: "",
        service_type: services[0]?.title || "Riset & Analisis Opini Publik",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/kontak", {
            onSuccess: () =>
                reset("name", "institution", "email", "phone", "message"),
        });
    };

    return (
        <MainLayout>
            <Head title="Kontak — Cyrus Network" />

            <section className="bg-slate-900 text-white py-16 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-400">
                        Hubungi Kami
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mt-2">
                        Konsultasi &amp; Kerja Sama Riset
                    </h1>
                    <p className="text-slate-300 mt-4 max-w-2xl leading-relaxed">
                        Sampaikan kebutuhan riset opini publik, konsultasi
                        strategis, atau permintaan wawancara media kepada tim
                        kami di Jakarta Selatan.
                    </p>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">
                                Kantor Pusat Cyrus Network
                            </h2>
                            <div className="space-y-4 text-sm text-slate-600">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Alamat
                                    </p>
                                    <p>
                                        Jakarta Selatan, DKI Jakarta, Indonesia
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Email Resmi
                                    </p>
                                    <p>info@cyrusnetwork.id</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        Bidang Layanan
                                    </p>
                                    <p>
                                        Riset Opini Publik, Quick Count,
                                        Strategi Kampanye Digital, dan Public
                                        Affairs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">
                                Kirim Pesan / Permintaan Konsultasi
                            </h2>

                            {props.flash?.success && (
                                <div className="mb-6 p-4 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                                    {props.flash.success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nama Lengkap *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-red-700 focus:outline-none"
                                            placeholder="Nama Anda"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Institusi / Organisasi
                                        </label>
                                        <input
                                            type="text"
                                            value={data.institution}
                                            onChange={(e) =>
                                                setData(
                                                    "institution",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-red-700 focus:outline-none"
                                            placeholder="Nama lembaga / perusahaan"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Alamat Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-red-700 focus:outline-none"
                                            placeholder="email@institusi.com"
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nomor Telepon / WhatsApp
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-red-700 focus:outline-none"
                                            placeholder="0812..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Topik Layanan *
                                    </label>
                                    <select
                                        value={data.service_type}
                                        onChange={(e) =>
                                            setData(
                                                "service_type",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm bg-white focus:border-red-700 focus:outline-none"
                                    >
                                        {services.map((service) => (
                                            <option
                                                key={service.id}
                                                value={service.title}
                                            >
                                                {service.title}
                                            </option>
                                        ))}
                                        <option value="Wawancara Media / Pers">
                                            Wawancara Media / Pers
                                        </option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.service_type && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.service_type}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Detail Kebutuhan / Pesan *
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-red-700 focus:outline-none"
                                        placeholder="Jelaskan secara singkat rencana riset atau konsultasi yang dibutuhkan..."
                                    />
                                    {errors.message && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-semibold text-sm px-6 py-3 rounded transition"
                                >
                                    {processing
                                        ? "Mengirim..."
                                        : "Kirim Permintaan"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
