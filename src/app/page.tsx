"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";

const mediaSchema = z.array(
  z.object({
    id: z.string(),
    url: z.string(),
    isFavorite: z.boolean(),
  }).passthrough()
);

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["favorite-images"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const { data } = await axios.get(`${apiUrl}/api/media`);
      const parsed = mediaSchema.parse(data);
      return parsed.filter((img) => img.isFavorite).map((img) => img.url);
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/30 font-sans dark custom-scrollbar overflow-hidden sm:overflow-auto">
      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 max-w-6xl mx-auto w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 transition-all">
        <Link href="#inicio" className="flex items-center">
          <Image src="/logo.png" alt="Merali Studio Logo" width={60} height={30} className="object-contain" />
        </Link>
        <nav className="flex items-center space-x-6 md:space-x-10 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
          <Link href="#inicio" className="hover:text-white transition-colors">
            Início
          </Link>
          <Link href="#quem-somos" className="hover:text-white transition-colors">
            Quem Somos
          </Link>
          <Link href="#projetos" className="hover:text-white transition-colors">
            Projetos
          </Link>
          <Link
            href="#servicos"
            className="hover:text-white transition-colors hidden sm:block"
          >
            Serviços
          </Link>
          <Link
            href="#vagas"
            className="hover:text-white transition-colors hidden sm:block"
          >
            Vaga
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section
        id="inicio"
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Abstract Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/render.jpg"
            alt="Space Background"
            fill
            className="object-cover opacity-50 scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-[#050505]/60 block" />
          <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-transparent to-[#050505]/30 block" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 md:px-12 flex h-full items-end pb-32 md:pb-48 justify-end">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-6 md:gap-12"
          >
            <div className="max-w-3xl text-right flex flex-col items-end">
              <h1 className="text-[3rem] sm:text-[5rem] md:text-[6.5rem] leading-[0.9] font-black uppercase tracking-tighter text-white drop-shadow-2xl hero-text">
                <span className="block opacity-90">Explorando</span>
                <span className="block text-transparent bg-clip-text bg-linear-to-br from-white via-white/80 to-white/20">
                  Universos
                </span>
                <span className="block italic font-bold">Criativos</span>
              </h1>
              <p className="mt-8 max-w-sm text-xs md:text-sm text-white/50 tracking-widest uppercase font-medium border-r-2 border-white/30 pr-4">
                Visualização arquitetônica de
                <br />
                alto impacto e precisão.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY SECTION (MASONRY WITHOUT GAPS EXACTLY LIKE REF 1) */}
      <section
        id="projetos"
        className="relative w-full bg-[#050505] z-20 pb-20"
      >
        <div className="w-full">
          {/* Note: columns logic using tailwind */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 w-full">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-[10px] md:text-sm font-semibold tracking-[0.2em] uppercase text-white/50 animate-pulse break-inside-avoid">
                Carregando universos...
              </div>
            ) : images.length === 0 ? (
              <div className="col-span-full py-20 text-center text-[10px] md:text-sm font-semibold tracking-[0.2em] uppercase text-white/50 break-inside-avoid">
                Nenhum projeto em destaque.
              </div>
            ) : null}
            {images.map((img, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedIndex(i)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (i % 5) * 0.15 }}
                className="relative w-full break-inside-avoid overflow-hidden mb-2 cursor-pointer group"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
                <Image
                  src={img}
                  alt={`Portfolio ${i}`}
                  loading="lazy"
                  width={1200}
                  height={1200}
                  unoptimized
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative w-full bg-[#030303] text-white py-20 px-6 md:px-12 border-t border-white/5 overflow-hidden">
        {/* Subtle Github style glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 px-8 rounded-full bg-linear-to-r from-transparent via-white/20 to-transparent blur-sm"></div>

        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
              Vamos construir
              <br />
              algo juntos?
            </h2>
            <Button className="mt-4 px-8 py-6 bg-white text-black hover:bg-white/90 text-xs font-bold tracking-widest uppercase rounded-full transition-all self-start w-max">
              Entrar em contato
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-xs tracking-widest uppercase font-medium text-white/60">
            <div className="flex flex-col gap-3">
              <span className="text-white mb-2 text-[10px] opacity-50">
                Navegação
              </span>
              <Link
                href="#inicio"
                className="hover:text-white transition-colors"
              >
                Início
              </Link>
              <Link
                href="#projetos"
                className="hover:text-white transition-colors"
              >
                Projetos
              </Link>
              <Link
                href="#escritorio"
                className="hover:text-white transition-colors"
              >
                Escritório
              </Link>
              <Link
                href="#servicos"
                className="hover:text-white transition-colors"
              >
                Serviços
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white mb-2 text-[10px] opacity-50">
                Social
              </span>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Pinterest
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Behance
              </a>
            </div>
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <span className="text-white mb-2 text-[10px] opacity-50">
                Contato
              </span>
              <a
                href="mailto:contato@merali.arq.br"
                className="hover:text-white transition-colors normal-case tracking-normal"
              >
                contato@merali.arq.br
              </a>
              <span className="normal-case tracking-normal">
                +55 11 99999-9999
              </span>
              <span className="normal-case tracking-normal">São Paulo, SP</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-medium tracking-[0.2em] text-white/30">
          <p>© 2026 Merali Studio. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Powered by Code</span>
          </div>
        </div>
      </footer>

      {/* GALLERY MODAL */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 bg-[#050505] flex items-center justify-center overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-6 right-6 md:right-10 z-110 text-white/50 hover:text-white transition-colors p-2"
            >
              <X className="w-8 h-8" strokeWidth={1.5} />
            </button>

            {/* Back Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-110 text-white/50 hover:text-white transition-colors p-4"
              >
                <ChevronLeft className="w-10 h-10 md:w-16 md:h-16" strokeWidth={1} />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-110 text-white/50 hover:text-white transition-colors p-4"
              >
                <ChevronRight className="w-10 h-10 md:w-16 md:h-16" strokeWidth={1} />
              </button>
            )}

            <div className="w-full h-full flex items-center justify-center relative">
              {/* Previous Image Background */}
              {images.length > 1 && (
                <div 
                   className="hidden md:flex absolute right-[85vw] h-full items-center justify-end w-[50vw] select-none"
                   onClick={() => setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))}
                >
                  <Image
                    src={images[selectedIndex === 0 ? images.length - 1 : selectedIndex - 1]}
                    className="max-h-[85vh] w-auto object-contain opacity-20 hover:opacity-40 transition-opacity cursor-pointer"
                    alt="Previous"
                    width={1200}
                    height={1200}
                    unoptimized
                  />
                </div>
              )}

              {/* Current Image */}
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 w-full max-w-[80vw] mx-auto flex items-center justify-center p-4 md:p-0"
              >
                <Image
                  src={images[selectedIndex]}
                  alt="Gallery Selected"
                  className="max-h-[85vh] w-full object-contain shadow-2xl select-none"
                  width={1920}
                  height={1080}
                  unoptimized
                />
              </motion.div>

              {/* Next Image Background */}
              {images.length > 1 && (
                <div 
                   className="hidden md:flex absolute left-[85vw] h-full items-center justify-start w-[50vw] select-none"
                   onClick={() => setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))}
                >
                  <Image
                    src={images[selectedIndex === images.length - 1 ? 0 : selectedIndex + 1]}
                    className="max-h-[85vh] w-auto object-contain opacity-20 hover:opacity-40 transition-opacity cursor-pointer"
                    alt="Next"
                    width={1200}
                    height={1200}
                    unoptimized
                  />
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 z-0 bg-transparent" onClick={() => setSelectedIndex(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
