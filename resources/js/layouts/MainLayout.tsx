import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { label: "Beranda", href: "/" },
        { label: "Tentang Kami", href: "/tentang-kami" },
        { label: "Layanan", href: "/layanan" },
        { label: "Publikasi & Riset", href: "/publikasi" },
        { label: "Kontak", href: "/kontak" },
    ];

    const isActive = (href: string) => {
        if (href === "/") return url === "/";
        return url.startsWith(href);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
            {/* Navbar Putih agar menyatu dengan background logo */}
            <header className="sticky top-0 z-50 bg-white text-slate-900 border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center shrink-0">
                            <img
                                src="/images/logo-cyrus.png"
                                alt="Cyrus Network"
                                className="h-12 sm:h-14 w-auto object-contain"
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors ${
                                        isActive(item.href)
                                            ? "text-red-700 font-bold"
                                            : "text-slate-700 hover:text-blue-800"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/kontak"
                                className="bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded transition"
                            >
                                Konsultasi Strategis
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded text-slate-700 hover:text-slate-950"
                            aria-label="Toggle Menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-2 shadow-md">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-sm font-medium ${
                                    isActive(item.href)
                                        ? "text-red-700 font-bold"
                                        : "text-slate-700"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="grow">{children}</main>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="bg-white inline-block px-3 py-2 rounded-lg mb-4">
                                <img
                                    src="/images/logo-cyrus.png"
                                    alt="Cyrus Network"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <p className="text-sm leading-relaxed">
                                Lembaga konsultan politik, riset opini publik,
                                dan komunikasi strategis yang berbasis di
                                Jakarta Selatan. Berdiri sejak tahun 2010.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                                Navigasi
                            </h4>
                            <ul className="space-y-2 text-sm">
                                {navItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="hover:text-white transition"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                                Kantor Pusat
                            </h4>
                            <p className="text-sm leading-relaxed">
                                Jakarta Selatan, DKI Jakarta
                                <br />
                                Indonesia
                                <br />
                                Website: www.cyrusnetwork.co
                                <br />
                                Email: info@cyrusnetwork.co
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-10 pt-6 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p>
                            &copy; {new Date().getFullYear()} Cyrus Network. Hak
                            Cipta Dilindungi.
                        </p>
                        <p>
                            Riset Opini Publik &bull; Strategi Kampanye &bull;
                            Public Affairs
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
