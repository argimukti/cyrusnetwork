import React from "react";
import { Link, usePage } from "@inertiajs/react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const ROLE_LABELS: Record<string, { label: string; badgeClass: string }> = {
    admin: { label: "Super Admin", badgeClass: "bg-red-700 text-white" },
    leader: {
        label: "Leader / Pimpinan",
        badgeClass: "bg-amber-600 text-white",
    },
    peneliti: { label: "Tim Riset", badgeClass: "bg-blue-700 text-white" },
    humas: { label: "Humas & Ops", badgeClass: "bg-emerald-700 text-white" },
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { url, props } = usePage<{
        auth?: {
            user?: {
                name: string;
                email: string;
                role?: string;
                must_change_password?: boolean;
            };
        };
        flash?: { success?: string; warning?: string };
    }>();

    const user = props.auth?.user;
    const role = user?.role || "peneliti";
    const roleInfo = ROLE_LABELS[role] || {
        label: role,
        badgeClass: "bg-slate-700 text-white",
    };

    const allMenuItems = [
        {
            label: "Dashboard",
            href: "/dashboard",
            roles: ["admin", "leader", "peneliti", "humas"],
        },
        {
            label: "Publikasi & Riset",
            href: "/admin/articles",
            roles: ["admin", "leader", "peneliti"],
        },
        {
            label: "Pimpinan",
            href: "/admin/leaders",
            roles: ["admin", "humas"],
        },
        {
            label: "Layanan",
            href: "/admin/services",
            roles: ["admin", "humas"],
        },
        {
            label: "Rekam Jejak",
            href: "/admin/track-records",
            roles: ["admin", "humas"],
        },
        { label: "Kelola Akun", href: "/admin/users", roles: ["admin"] },
        {
            label: "Profil & Password",
            href: "/admin/profile",
            roles: ["admin", "leader", "peneliti", "humas"],
        },
    ];

    const visibleMenus = allMenuItems.filter((item) =>
        item.roles.includes(role),
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
            {/* Topbar Admin */}
            <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-sm">
                {/* Baris 1: Brand & Info Pengguna */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <Link
                        href="/dashboard"
                        className="font-bold tracking-wider uppercase text-sm flex items-center gap-2.5 shrink-0"
                    >
                        <span className="px-2 py-1 rounded bg-red-700 text-white text-xs font-extrabold">
                            CN
                        </span>
                        <span className="whitespace-nowrap">
                            Portal Internal
                        </span>
                    </Link>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-medium border border-slate-700 px-3 py-1.5 rounded-md whitespace-nowrap transition"
                        >
                            <span>Lihat Website</span>
                            <svg
                                className="w-3.5 h-3.5 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>

                        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-800">
                            <span className="text-slate-300 text-xs font-medium whitespace-nowrap">
                                {user?.name}
                            </span>
                            <span
                                className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded whitespace-nowrap ${roleInfo.badgeClass}`}
                            >
                                {roleInfo.label}
                            </span>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-xs font-semibold text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded hover:bg-slate-900 whitespace-nowrap cursor-pointer transition"
                        >
                            Keluar
                        </Link>
                    </div>
                </div>

                {/* Baris 2: Menu Navigasi */}
                <div className="bg-slate-900 border-t border-b border-slate-800">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 overflow-x-auto">
                        {visibleMenus.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                                    url.startsWith(item.href)
                                        ? "bg-red-700 text-white shadow-xs"
                                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Konten Utama */}
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {props.flash?.success && (
                    <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                        {props.flash.success}
                    </div>
                )}
                {props.flash?.warning && (
                    <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-sm font-medium">
                        {props.flash.warning}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
