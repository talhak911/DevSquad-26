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
        <section className="bg-[#F1F2FF] w-full text-center flex flex-col items-center gap-4 py-16 max-sm:py-10 px-5">
            <h1 className="font-[family-name:var(--font-sans)] text-[64px] max-sm:text-[40px] font-bold leading-tight text-[#2E3D83]">
                {title}
            </h1>
            <div className="w-[100px] h-[3px] bg-[#2E3D83] opacity-20 rounded-full" />
            {subtitle && (
                <p className="text-[18px] font-medium text-[#545677]">{subtitle}</p>
            )}
            {breadcrumbs && (
                <div className="flex items-center gap-2 mt-4">
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-2">
                            {i > 0 && <ChevronRight size={14} className="text-[#939393]" />}
                            {crumb.href ? (
                                <a href={crumb.href} className="text-[14px] font-bold text-[#939393] hover:text-[#2E3D83] transition-colors">
                                    {crumb.label}
                                </a>
                            ) : (
                                <span className="text-[14px] font-bold text-[#2E3D83]">{crumb.label}</span>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}