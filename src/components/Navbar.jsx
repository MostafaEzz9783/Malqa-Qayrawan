import { Globe } from "lucide-react";
import FloatingPanel from "@/components/ui/FloatingPanel";
import ProjectSelector from "@/components/ProjectSelector";

export default function Navbar({ t, language, selectedProject, onProjectChange, onToggleLanguage }) {
  return (
    <div className="sticky top-4 z-50 px-4 sm:px-6">
      <FloatingPanel className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <ProjectSelector t={t} language={language} selectedProject={selectedProject} onProjectChange={onProjectChange} />
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BF7C4A]"
            style={{ color: "#F5F3EF", backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <Globe size={13} />
            {t.nav.languageToggle}
          </button>
        </div>

        {/* Same light "coin" backing treatment as the splash screen logo, scaled
            down for the navbar - keeps the dark-purple wordmark legible and
            gives the two brand touchpoints a consistent look. */}
        <div
          className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full"
          style={{ backgroundColor: "#FBF9F5", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)" }}
        >
          <img src="/logo.png" alt={t.nav.brandAlt} className="relative h-10 sm:h-11 object-contain" />
        </div>
      </FloatingPanel>
    </div>
  );
}
