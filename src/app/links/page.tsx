"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Instagram,
    Linkedin,
    Globe,
    MessageCircle,
    Mail,
    Palette,
    Image as ImageIcon,
    Link2,
    Phone,
    ArrowRight,
    Loader2,
} from "lucide-react";

interface BioLink {
    id: string;
    title: string;
    url: string;
    icon?: string | null;
    order: number;
    isActive: boolean;
}

const getIconByName = (name?: string | null) => {
    if (!name) return Link2;
    const n = name.toLowerCase();
    if (n.includes("whatsapp")) return MessageCircle;
    if (n.includes("instagram")) return Instagram;
    if (n.includes("linkedin")) return Linkedin;
    if (n.includes("site") || n.includes("website")) return Globe;
    if (n.includes("email") || n.includes("mail")) return Mail;
    if (n.includes("behance") || n.includes("portfolio")) return Palette;
    if (n.includes("pinterest")) return ImageIcon;
    if (n.includes("phone") || n.includes("telefone")) return Phone;
    return Link2;
};

export default function LinksBioPage() {
    const { data: links = [], isLoading } = useQuery<BioLink[]>({
        queryKey: ["bio-links"],
        queryFn: async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const { data } = await axios.get(`${apiUrl}/api/bio-links`);
            return data;
        },
    });

    const activeLinks = useMemo(() => {
        return links
            .filter((l) => l.isActive)
            .sort((a, b) => a.order - b.order);
    }, [links]);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <Image
                    src="/render.jpg"
                    alt="Space Background"
                    fill
                    className="object-cover opacity-10 blur-3xl scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-[#050505]/50 via-transparent to-[#050505] block" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
                {/* Profile / Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-row items-center justify-between mb-12 w-full"
                >
                    <Link href="/" className="flex shrink-0 items-center justify-center hover:scale-105 transition-transform active:scale-95">
                        <Image
                            src="/logo.png"
                            alt="Merali Studio"
                            width={80}
                            height={80}
                            className="object-contain w-auto h-16 md:h-20 invert grayscale"
                        />
                    </Link>
                    <div className="flex flex-col items-end gap-1 text-right">
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">
                            Merali Studio
                        </h1>
                        <p className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-[0.2em] font-bold">
                            Pure Visual Prestige.
                        </p>
                    </div>
                </motion.div>

                {/* Links List */}
                <div className="w-full flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-4 w-full">
                            <Loader2 className="w-8 h-8 text-white/20 animate-spin" strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                                Carregando links...
                            </span>
                        </div>
                    ) : activeLinks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 w-full">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
                                Nenhum link ativo no momento.
                            </span>
                        </div>
                    ) : (
                        activeLinks.map((link, i) => {
                            const Icon = getIconByName(link.icon);
                            return (
                                <motion.a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.2 + i * 0.1,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="group relative w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white hover:border-white transition-all duration-300 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                                            <Icon className="w-5 h-5 text-white/80 group-hover:text-black" />
                                        </div>
                                        <span className="font-bold text-sm tracking-wide text-white group-hover:text-black transition-colors">
                                            {link.title}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-black/50 group-hover:-rotate-45 transition-all" />
                                </motion.a>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-20 pt-8 border-t border-white/5 w-full text-center"
                >
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">
                        © {new Date().getFullYear()} Merali Studio.
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
