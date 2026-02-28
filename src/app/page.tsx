"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ChevronUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

const mediaSchema = z.array(
  z.object({
    id: z.string(),
    url: z.string(),
    isFavorite: z.boolean(),
  }).passthrough()
);

function GalleryItem({ img, i, onClick }: { img: string; i: number; onClick: () => void }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: (i % 5) * 0.15 }}
      className="relative w-full break-inside-avoid overflow-hidden mb-2 cursor-pointer group rounded-lg"
    >
      {/* Skeleton / Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white/40 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10" />
      <Image
        src={img}
        alt={`Portfolio ${i}`}
        loading="lazy"
        width={1200}
        height={1200}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto object-cover transition-all duration-700 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
      />
    </motion.div>
  );
}

function ModalImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative z-10 w-full max-w-[80vw] mx-auto flex items-center justify-center p-4 md:p-0">
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20">
          <Loader2 className="w-16 h-16 text-white/10 animate-spin" strokeWidth={1} />
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-black">
            Carregando Obra
          </span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`max-h-[85vh] w-full object-contain shadow-2xl select-none transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        width={1920}
        height={1080}
        priority
      />
    </div>
  );
}

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    gsap.to(window, { duration: 1.2, scrollTo: 0, ease: "power3.inOut" });
  };


  const { data: images = [], isLoading } = useQuery({
    queryKey: ["favorite-images"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const { data } = await axios.get(`${apiUrl}/api/media`);
      const parsed = mediaSchema.parse(data);
      return parsed.filter((img) => img.isFavorite).map((img) => img.url);
    }
  });

  interface PortfolioConfig {
    key: string;
    value: string;
  }

  interface ConfigGroup {
    id: string;
    name: string;
    configs: PortfolioConfig[];
  }

  const { data: configGroups = [] } = useQuery<ConfigGroup[]>({
    queryKey: ["portfolio-configs"],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const { data } = await axios.get(`${apiUrl}/api/configs`);
      return data;
    }
  });

  const portfolioConfigs = useMemo(() => {
    const group = configGroups.find((g) => g.name === "portfolio");
    const configs: Record<string, string> = {
      heroTitle: "Pure Visual Prestige.",
      heroSubtitle: "Elevando projetos arquitetônicos ao patamar de obra de arte através do hiper-realismo extremo.",
      manifestoTitle: "Não entregamos imagens. Entregamos o amanhã.",
      manifestoText: "A Merali Studio nasceu da obsessão pelo detalhe. Atuamos como um laboratório de luz e atmosfera, onde cada pixel é esculpido para criar a ilusão perfeita da realidade.",
      contactEmail: "contato@merali.com.br",
      contactWhatsApp: "+55 61 99999-9999"
    };

    if (group && group.configs) {
      group.configs.forEach((c) => {
        configs[c.key] = c.value;
      });
    }
    return configs;
  }, [configGroups]);


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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    gsap.to(window, { duration: 1.2, scrollTo: href, ease: "power3.inOut" });
  };


  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/30 font-sans dark custom-scrollbar">
      {/* HEADER */}
      <header className="absolute top-0 left-0 right-0 w-full z-50 px-6 md:px-12 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-6 md:py-10">
          <Link href="#inicio" onClick={(e) => scrollToSection(e, "#inicio")} className="flex items-center">
            <Image src="/logo.png" alt="Merali Studio Logo" width={60} height={30} className="object-contain" />
          </Link>
          <nav className="flex items-center space-x-4 md:space-x-10 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-white/80">
            <Link href="#inicio" onClick={(e) => scrollToSection(e, "#inicio")} className="hover:text-white transition-colors">
              Início
            </Link>
            <Link href="#quem-somos" onClick={(e) => scrollToSection(e, "#quem-somos")} className="hover:text-white transition-colors">
              Quem Somos
            </Link>
            <Link href="#projetos" onClick={(e) => scrollToSection(e, "#projetos")} className="hover:text-white transition-colors">
              Projetos
            </Link>
            <Link
              href="#contato"
              onClick={(e) => scrollToSection(e, "#contato")}
              className="hover:text-white transition-colors hidden sm:block"
            >
              Contato
            </Link>
          </nav>
        </div>
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

        <div className="relative z-20 w-full px-6 md:px-12">
          <div className="max-w-6xl mx-auto pt-80 pb-32">
            <div className="max-w-4xl text-left flex flex-col items-start">
              <h1 className="text-[3.5rem] sm:text-[6rem] md:text-[8rem] leading-[0.85] font-black uppercase tracking-tighter text-white drop-shadow-2xl hero-text">
                <motion.span
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="block overflow-hidden"
                >
                  {portfolioConfigs.heroTitle.split(" ")[0]}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                  className="block text-transparent bg-clip-text bg-linear-to-b from-white to-white/10"
                >
                  {portfolioConfigs.heroTitle.split(" ")[1]}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  className="block italic font-light tracking-[-0.05em] lowercase opacity-50"
                >
                  {portfolioConfigs.heroTitle.split(" ").slice(2).join(" ")}
                </motion.span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12 w-full">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="max-w-md text-[10px] md:text-sm text-white/40 tracking-[0.2em] uppercase font-bold leading-relaxed pr-6"
                >
                  {portfolioConfigs.heroSubtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex gap-4"
                >
                  <Link href="#projetos" onClick={(e) => scrollToSection(e, "#projetos")} className="group relative px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
                    <span className="relative z-10">Explorar Portfolio</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGIC SECTION: DEFINITION */}
      <section id="quem-somos" className="relative w-full bg-[#050505] py-40 px-6 md:px-12 border-b border-white/5 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.3 }}
            className="text-[10px] uppercase tracking-[0.8em] font-black mb-12 block"
          >
            Manifesto
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-8"
          >
            {portfolioConfigs.manifestoTitle.split(".")[0]}. <br />
            <span className="text-white/40 italic">{portfolioConfigs.manifestoTitle.split(".")[1]}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-md md:text-xl text-white/60 font-light leading-relaxed max-w-2xl"
          >
            {portfolioConfigs.manifestoText}
          </motion.p>
        </div>
      </section>

      {/* GALLERY SECTION (CURATED WORLDS) */}
      <section
        id="projetos"
        className="relative w-full bg-[#050505] z-20 py-32"
      >
        <div className="max-w-6xl mx-auto px-6 mb-20 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">Projetos <span className="opacity-40">Selecionados</span></h2>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Curadoria</span>
          </div>
        </div>
        <div className="w-full px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-60 gap-6 w-full">
              <Loader2 className="w-12 h-12 text-white/20 animate-spin" strokeWidth={1} />
              <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-white/30">
                Sincronizando Galeria
              </span>
            </div>
          ) : images.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center w-full">
              <span className="text-[10px] md:text-sm font-semibold tracking-[0.2em] uppercase text-white/20">
                Nenhum projeto em destaque no momento.
              </span>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 w-full">
              {images.map((img, i) => (
                <GalleryItem
                  key={i}
                  img={img}
                  i={i}
                  onClick={() => setSelectedIndex(i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT SECTION (HIGH CONVERSION) */}
      <section id="contato" className="relative w-full bg-[#050505] py-40 px-6 md:px-12 border-t border-white/5 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl"
        >
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
            Seu próximo <br /> <span className="text-transparent bg-clip-text bg-linear-to-b from-white/80 to-transparent">Marco Começa</span> <br /> Aqui.
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a href={`mailto:${portfolioConfigs.contactEmail}`} className="px-12 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-full hover:scale-105 transition-transform active:scale-95">
              Enviar Email
            </a>
          </div>
        </motion.div>
      </section>

      {/* FOOTER RAZÃO SOCIAL */}
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
            <Link href={`https://wa.me/${portfolioConfigs.contactWhatsApp.replace(/\D/g, "")}`} target="_blank" className="cursor-pointer mt-4 px-8 py-6 bg-white text-black hover:bg-white/90 text-xs font-bold tracking-widest uppercase rounded-full transition-all self-start w-max">
              Entrar em contato
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-xs tracking-widest uppercase font-medium text-white/60">
            <div className="flex flex-col gap-3">
              <span className="text-white mb-2 text-[10px] opacity-50">
                Navegação
              </span>
              <Link
                href="#inicio"
                onClick={(e) => scrollToSection(e, "#inicio")}
                className="hover:text-white transition-colors"
              >
                Início
              </Link>
              <Link
                href="#projetos"
                onClick={(e) => scrollToSection(e, "#projetos")}
                className="hover:text-white transition-colors"
              >
                Projetos
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white mb-2 text-[10px] opacity-50">
                Social
              </span>
              <a href="https://www.instagram.com/archmerali" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="https://br.pinterest.com/archmerali/" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                Pinterest
              </a>
              <a href="https://www.behance.net/archmerali" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                Behance
              </a>
            </div>
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <span className="text-white mb-2 text-[10px] opacity-50">
                Whatsapp
              </span>
              <a
                href={`mailto:${portfolioConfigs.contactEmail}`}
                className="hover:text-white transition-colors normal-case tracking-normal"
              >
                {portfolioConfigs.contactEmail}
              </a>
              <span className="normal-case tracking-normal">
                {portfolioConfigs.contactWhatsApp}
              </span>
              <span className="normal-case tracking-normal">Brasília, DF</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase font-medium tracking-[0.2em] text-white/30">
          <p>© 2026 Merali Studio. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span>Powered by Merali Studio</span>
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
                    src={images[selectedIndex === 0 ? images.length - 1 : (selectedIndex as number) - 1]}
                    className="max-h-[85vh] w-auto object-contain opacity-20 hover:opacity-40 transition-opacity cursor-pointer"
                    alt="Previous"
                    width={1200}
                    height={1200}
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
                className="w-full flex items-center justify-center p-4 md:p-0"
              >
                <ModalImage
                  src={images[selectedIndex as number]}
                  alt="Gallery Selected"
                />
              </motion.div>

              {/* Next Image Background */}
              {images.length > 1 && (
                <div
                  className="hidden md:flex absolute left-[85vw] h-full items-center justify-start w-[50vw] select-none"
                  onClick={() => setSelectedIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))}
                >
                  <Image
                    src={images[selectedIndex === images.length - 1 ? 0 : (selectedIndex as number) + 1]}
                    className="max-h-[85vh] w-auto object-contain opacity-20 hover:opacity-40 transition-opacity cursor-pointer"
                    alt="Next"
                    width={1200}
                    height={1200}
                  />
                </div>
              )}
            </div>

            <div className="absolute inset-0 z-0 bg-transparent" onClick={() => setSelectedIndex(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-60 p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full shadow-2xl hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all group"
          >
            <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>

  );
}
