"use client";
import { ChevronRight } from "lucide-react";

export default function PageHero({
    title,
    subtitle,
    breadcrumbs,
}: {
    title: string;
    subtitle?: string;
    breadcrumbs?: { label: string; href?: string }[];
}) {
    return (
        <section className="bg-[#F1F2FF] w-full text-center flex flex-col items-center gap-4 py-16 max-sm:py-12 px-5 relative overflow-hidden">
            <h1 className="font-[family-name:var(--font-sans)] text-4xl sm:text-5xl md:text-6xl font-black leading-tight text-[#2E3D83] uppercase tracking-tighter">
                {title}
            </h1>
            <div className="w-[100px] h-[3px] bg-[#2E3D83] opacity-20 rounded-full" />
            {subtitle && (
                <p className="text-[18px] font-medium text-[#545677]">{subtitle}</p>
            )}
            {breadcrumbs && (
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-4 max-w-full overflow-hidden">
                    {breadcrumbs.map((crumb, i) => (
                        <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                            {i > 0 && <ChevronRight size={14} className="text-[#939393] shrink-0" />}
                            {crumb.href ? (
                                <a href={crumb.href} className="text-[13px] font-bold text-[#939393] hover:text-[#2E3D83] transition-colors">
                                    {crumb.label}
                                </a>
                            ) : (
                                <span className="text-[13px] font-bold text-[#2E3D83] truncate max-w-[150px] sm:max-w-none">{crumb.label}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}