import { memo, useState } from "react";
import { Expand, FileDown, GitCompare, Minimize } from "lucide-react";
import PremiumButton from "@/components/ui/PremiumButton";

function Toolbar({ t, isFullscreen, onToggleFullscreen, exportTargetRef, exportFileName, showCompare, onToggleCompare }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!exportTargetRef.current) return;
    setIsExporting(true);

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(exportTargetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#151522",
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      const fittedHeight = Math.min(imageHeight, pageHeight);
      const fittedWidth = imageHeight > pageHeight ? (canvas.width * pageHeight) / canvas.height : imageWidth;

      pdf.addImage(
        imageData,
        "JPEG",
        (pageWidth - fittedWidth) / 2,
        (pageHeight - fittedHeight) / 2,
        fittedWidth,
        fittedHeight,
      );
      pdf.save(`${exportFileName ?? "Financial-Study"}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 mb-6">
      <PremiumButton
        icon={GitCompare}
        variant={showCompare ? "solid" : "ghost"}
        onClick={onToggleCompare}
        aria-pressed={showCompare}
      >
        {t.widgets.compareProjects}
      </PremiumButton>
      <PremiumButton icon={FileDown} variant="ghost" disabled={isExporting} onClick={handleExport}>
        {isExporting ? t.toolbar.exportingPdf : t.toolbar.exportPdf}
      </PremiumButton>
      <PremiumButton icon={isFullscreen ? Minimize : Expand} variant="ghost" onClick={onToggleFullscreen}>
        {isFullscreen ? t.toolbar.exitFullscreen : t.toolbar.fullscreen}
      </PremiumButton>
    </div>
  );
}

export default memo(Toolbar);
