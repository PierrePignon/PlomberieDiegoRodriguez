import { useRef, useState } from "react";
import { Upload, X, Camera, CheckCircle2 } from "lucide-react";
import PhotoExampleIllustration from "./PhotoExampleIllustration";

/**
 * Champ d'upload de photo guidé : montre un schéma SVG cohérent + zone d'upload.
 *
 * Props :
 *   number       : numéro de l'étape (1, 2, 3)
 *   icon         : composant icon Lucide (ex: <Maximize2 />)
 *   title        : titre de l'étape (ex: "Vue large")
 *   instruction  : ce qu'il faut photographier (ex: "Toute la pièce ou l'environnement")
 *   tip          : un conseil court ("Reculez de 2-3 m...")
 *   level        : "large" | "medium" | "close" — pour l'illustration SVG
 *   value        : File object actuellement sélectionné (ou null)
 *   onChange     : callback (file: File | null) => void
 *   accent       : "orange" | "blue" | "green" — couleur d'accent de l'étape
 */
export default function PhotoUploadField({
  number,
  icon: Icon,
  title,
  instruction,
  tip,
  level = "large",
  value,
  onChange,
  accent = "orange",
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const colors = {
    orange: { ring: "ring-orange-500", bg: "bg-orange-500", text: "text-orange-500", border: "border-orange-500" },
    blue: { ring: "ring-blue-500", bg: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
    green: { ring: "ring-green-500", bg: "bg-green-500", text: "text-green-500", border: "border-green-500" },
  }[accent];

  const handleFile = (file) => {
    setError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Seules les images sont acceptées.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image trop lourde (max 10 MB).");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    onChange(file);
  };

  const removeFile = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const hasFile = !!value;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 border-b border-slate-100">
        <div
          className={`w-10 h-10 rounded-full ${colors.bg} text-white font-black flex items-center justify-center shrink-0`}
        >
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className={`w-5 h-5 ${colors.text}`} />}
            <h3 className="text-lg font-black text-abyss">{title}</h3>
          </div>
          <p className="text-sm text-slate-600">{instruction}</p>
        </div>
        {hasFile && (
          <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
        )}
      </div>

      {/* Body : schéma + upload — TOUTE la zone est cliquable et droppable quand pas de photo */}
      <div className="p-5 space-y-4">
        {!hasFile ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            className="block cursor-pointer space-y-4"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {/* Schéma illustratif SVG — devient une zone de drop visuelle */}
            <div className="relative">
              <div className="absolute -top-2 left-3 bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full z-10">
                {dragOver ? "Déposez ici" : "Comment cadrer"}
              </div>
              <div
                className={`relative rounded-xl overflow-hidden aspect-video transition-all ${
                  dragOver
                    ? `${colors.border} border-2 ring-4 ring-${accent}-200 bg-${accent}-50/30`
                    : "bg-slate-100 border-2 border-transparent"
                }`}
              >
                <PhotoExampleIllustration level={level} accent={`stroke-${accent}-500`} />
                {tip && (
                  <div className="absolute top-3 right-3 max-w-[60%] bg-black/75 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg flex items-start gap-2 pointer-events-none">
                    <Camera className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span>{tip}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA upload */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                dragOver
                  ? `${colors.border} bg-${accent}-50/40`
                  : "border-slate-300 hover:border-slate-400 bg-slate-50"
              }`}
            >
              <div className={`w-12 h-12 rounded-full ${colors.bg} text-white flex items-center justify-center mx-auto mb-3`}>
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-abyss mb-1">
                Touchez pour ajouter votre photo
              </div>
              <div className="text-xs text-slate-500">
                Ou glissez votre photo directement sur l'illustration
              </div>
            </div>
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-video group">
            {preview && (
              <img
                src={preview}
                alt="Votre photo"
                className="w-full h-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 w-9 h-9 bg-white/95 hover:bg-white text-abyss rounded-full flex items-center justify-center shadow-lg transition-all"
              aria-label="Supprimer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Photo ajoutée
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
