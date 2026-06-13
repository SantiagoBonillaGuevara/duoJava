// src/components/ui/AvatarPicker.jsx
import { useState } from "react";
import { buildAvatarCatalog } from "@/utils/avatars";

export default function AvatarPicker({
  currentUrl,
  googlePhotoUrl,
  onSave,
  loading,
}) {
  const [selected, setSelected] = useState(currentUrl);
  const catalog = buildAvatarCatalog(googlePhotoUrl);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-slate-300">Choose your avatar</p>

      <div className="grid grid-cols-5 gap-3 max-h-72 overflow-y-auto pr-1">
        {catalog.map(({ id, url, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelected(url)}
            className={`relative rounded-xl p-1 border-2 transition-all ${
              selected === url
                ? "border-[#6324eb] bg-[#6324eb]/10"
                : "border-transparent hover:border-slate-600"
            }`}
          >
            <img
              src={url}
              alt={id}
              className="w-full aspect-square rounded-lg bg-slate-800 object-cover"
            />
            {/* Etiqueta "Google" en la foto de Google */}
            {label && (
              <span className="absolute -top-1 -left-1 bg-white text-[8px] font-bold text-slate-700 px-1 rounded-full shadow">
                {label}
              </span>
            )}
            {/* Checkmark si está seleccionado */}
            {selected === url && (
              <span className="absolute -top-1 -right-1 material-symbols-outlined text-sm text-white bg-[#6324eb] rounded-full p-0.5">
                check
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onSave(selected)}
        disabled={selected === currentUrl || loading}
        className="w-full bg-[#6324eb] hover:bg-[#6324eb]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
      >
        {loading ? "Saving..." : "Save Avatar"}
      </button>
    </div>
  );
}
