import { useEffect, useRef, useState, forwardRef } from "react";
import { MapPin, AlertCircle, Wrench, Sparkles, Clock } from "lucide-react";
import BeforeAfterSlider from "../shared/BeforeAfterSlider";
import useScrollReveal from "../../hooks/useScrollReveal";

/**
 * Réalisation phare en mode "sticky scroll storytelling" premium.
 *
 * Desktop : le slider avant/après reste sticky à GAUCHE pendant que le storytelling
 * (problème → intervention → résultat) défile à DROITE en cascade animée.
 *
 * Mobile : tout vertical (slider en haut puis cards storytelling), avec animations.
 *
 * Pattern inspiré : pages produit Apple, Tesla, Linear.
 */
export default function FeaturedRealization({ realization, index, total = 1 }) {
  const r = realization;

  // Si pas d'avant/après, on n'affiche pas (les autres vont dans le feed du bas)
  if (!r.imageBefore || !r.imageAfter) return null;

  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Calcul de la progression de scroll dans la section pour barre latérale
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand le top entre, 1 quand le bottom sort
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{
        // Bg gradient subtil qui change légèrement entre projets
        background: index % 2 === 0
          ? "linear-gradient(180deg, #fff 0%, #fff 100%)"
          : "linear-gradient(180deg, #fafafa 0%, #fff 100%)"
      }}
    >
      {/* Séparateur élégant en haut */}
      {index > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        {/* Compteur de projet en haut, élégant */}
        <ProjectCounter index={index} total={total} progress={progress} type={r.type} city={r.city} />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mt-12">
          {/* SLIDER STICKY (à gauche sur desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
            <StickySlider realization={r} />
          </div>

          {/* STORYTELLING (à droite, défile) */}
          <div className="lg:col-span-5">
            <Storytelling realization={r} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 *  Compteur de projet élégant (numéro + ligne + meta)
 * ============================================================ */
function ProjectCounter({ index, total, progress, type, city }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="text-6xl md:text-7xl font-black text-abyss leading-none tabular-nums">
        {String(index).padStart(2, "0")}
      </div>
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="h-px bg-slate-300 flex-1 max-w-16" />
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Projet {index}
          {total > 1 && <span className="text-slate-300"> / {String(total).padStart(2, "0")}</span>}
        </div>
        <div className="h-px bg-slate-300 flex-1" />
      </div>
      <div className="hidden md:flex items-center gap-3 text-sm">
        <span className="bg-kinetic/10 text-kinetic font-bold px-3 py-1 rounded-full">
          {type}
        </span>
        <span className="flex items-center gap-1 text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-kinetic" />
          {city}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
 *  Slider avec frame élégante autour
 * ============================================================ */
function StickySlider({ realization }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });
  const r = realization;

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      }`}
    >
      {/* Wrapper avec ombre profonde + bordure subtile */}
      <div className="relative">
        {/* Halo orange subtil derrière */}
        <div className="absolute -inset-4 bg-gradient-to-br from-kinetic/20 to-transparent rounded-3xl blur-3xl opacity-50" />

        <div className="relative">
          <BeforeAfterSlider
            imageBefore={r.imageBefore}
            imageAfter={r.imageAfter}
            alt={r.title}
            className="h-[380px] sm:h-[460px] md:h-[540px] lg:h-[600px] w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
            showHint={true}
          />
        </div>

        {/* Mention démo discrète si placeholder */}
        {r.isDemo && (
          <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
            Démo
          </div>
        )}

        {/* Méta sous le slider (mobile : remplace le compteur en haut) */}
        <div className="md:hidden mt-4 flex items-center gap-2 text-sm">
          <span className="bg-kinetic/10 text-kinetic font-bold px-3 py-1 rounded-full">
            {r.type}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-kinetic" />
            {r.city}
          </span>
          {r.duration && (
            <span className="flex items-center gap-1 text-slate-500 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {r.duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 *  Storytelling : titre + 3 cards qui se révèlent en cascade
 * ============================================================ */
function Storytelling({ realization }) {
  const r = realization;

  const titleReveal = useScrollReveal({ threshold: 0.2 });
  const problemReveal = useScrollReveal({ threshold: 0.25 });
  const solutionReveal = useScrollReveal({ threshold: 0.25 });
  const resultReveal = useScrollReveal({ threshold: 0.25 });

  return (
    <div className="space-y-8 lg:py-12">
      {/* Titre principal */}
      <div
        ref={titleReveal.ref}
        className={`transition-all duration-1000 ${
          titleReveal.isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-abyss leading-[1.05]">
          {r.title}
        </h2>
        {r.duration && (
          <div className="hidden md:flex items-center gap-2 mt-4 text-slate-500 text-sm">
            <Clock className="w-4 h-4 text-kinetic" />
            <span className="font-medium">Chantier livré en {r.duration}</span>
          </div>
        )}
      </div>

      {/* Card 1 — Problème */}
      <StoryCard
        ref={problemReveal.ref}
        isVisible={problemReveal.isVisible}
        delay={150}
        icon={AlertCircle}
        iconColor="text-red-500"
        iconBg="bg-red-50"
        label="La situation"
        body={r.problem}
        accent="red"
      />

      {/* Card 2 — Intervention */}
      <StoryCard
        ref={solutionReveal.ref}
        isVisible={solutionReveal.isVisible}
        delay={300}
        icon={Wrench}
        iconColor="text-abyss"
        iconBg="bg-slate-100"
        label="L'intervention"
        body={r.solution}
        accent="slate"
      />

      {/* Card 3 — Résultat (mise en valeur) */}
      <StoryCard
        ref={resultReveal.ref}
        isVisible={resultReveal.isVisible}
        delay={450}
        icon={Sparkles}
        iconColor="text-kinetic"
        iconBg="bg-kinetic/10"
        label="Le résultat"
        body={r.result}
        accent="kinetic"
        highlight
      />
    </div>
  );
}

/* ============================================================
 *  Card de storytelling avec animation latérale
 * ============================================================ */
const StoryCard = forwardRef(function StoryCard(
  { isVisible, delay = 0, icon: Icon, iconColor, iconBg, label, body, highlight = false },
  ref
) {
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0 blur-0"
          : "opacity-0 translate-x-12 blur-sm"
      } ${
        highlight
          ? "bg-gradient-to-br from-kinetic/5 to-transparent border-l-4 border-kinetic pl-6 pr-5 py-5 -ml-6 sm:ml-0 rounded-r-2xl sm:rounded-2xl"
          : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className={`text-xs font-bold uppercase tracking-[0.2em] mb-2 ${highlight ? "text-kinetic" : "text-slate-400"}`}>
            {label}
          </div>
          <p className={`leading-relaxed ${highlight ? "text-abyss text-lg font-medium" : "text-slate-700"}`}>
            {body}
          </p>
        </div>
      </div>
    </div>
  );
});
