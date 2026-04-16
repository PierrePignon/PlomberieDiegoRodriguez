import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { BUSINESS } from "../../lib/business";

const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Réalisations", path: "/realisations" },
  { label: "Zone d'intervention", path: "/zones" },
  { label: "Avis clients", path: "/avis" },
  { label: "Contact", path: "/contact" },
  { label: "Rendez-vous", path: "/rendez-vous" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-abyss shadow-2xl" : "bg-abyss/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={BUSINESS.logo} alt="Plomberie Rodriguez Diego" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-none">Rodriguez Diego</div>
              <div className="text-kinetic text-xs font-medium mt-0.5 uppercase tracking-widest">Plomberie</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === l.path
                    ? "text-kinetic"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="hidden sm:flex items-center gap-2 bg-kinetic hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all pulse-glow"
            >
              <Phone className="w-4 h-4" />
              {BUSINESS.phoneDisplay}
            </a>
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-abyss border-t border-slate-800 pb-4">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="block px-6 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {l.label}
            </Link>
          ))}
          <div className="px-6 pt-3">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center justify-center gap-2 bg-kinetic text-white px-4 py-3 rounded-lg font-bold w-full"
            >
              <Phone className="w-5 h-5" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
