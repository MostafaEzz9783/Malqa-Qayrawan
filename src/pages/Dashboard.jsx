import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import FloatingBackground from "@/components/FloatingBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Toolbar from "@/components/Toolbar";
import SelectorsRow from "@/components/SelectorsRow";
import KPISection from "@/components/KPISection";
import OccupancyRing from "@/components/OccupancyRing";
import RoomPricingTable from "@/components/RoomPricingTable";
import OwnerEconomicsCard from "@/components/OwnerEconomicsCard";
import InvestmentHighlights from "@/components/InvestmentHighlights";
import ExecutiveClosing from "@/components/ExecutiveClosing";
import ProjectComparisonCard from "@/components/ProjectComparisonCard";
import SectionHeader from "@/components/ui/SectionHeader";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { projects, DEFAULT_PROJECT_ID, DEFAULT_OPTION_ID } from "@/data/projects";
import { closestOccupancyOption } from "@/data/arqaModelCalculations";

// Recharts-backed widgets are lazy-loaded - they're below the fold and not
// needed for first paint, so splitting them keeps the initial bundle light.
const RevenueDistributionDonut = lazy(() => import("@/components/RevenueDistributionDonut"));
const RevenueWaterfall = lazy(() => import("@/components/RevenueWaterfall"));
const PortfolioSnapshot = lazy(() => import("@/components/PortfolioSnapshot"));
const OccupancySensitivity = lazy(() => import("@/components/OccupancySensitivity"));
const SensitivityHeatmap = lazy(() => import("@/components/SensitivityHeatmap"));
const CashFlowTimeline = lazy(() => import("@/components/CashFlowTimeline"));

const MONTH_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DEFAULT_OCCUPANCY_TARGET = 80;

// Neither workbook tabulates monthly seasonality (that only existed in the
// legacy Arqa "Hybrid Projection" sheet), so - same convention the old
// LTR/STR path used - the annual net figure is split evenly across the 12
// months rather than inventing a seasonal shape the source doesn't support.
function getOptionSnapshot(option, scenario, occupancy) {
  const scenarioData = option.scenarios[scenario];
  const row = scenarioData.occupancy[occupancy];

  const monthlySeries = MONTH_KEYS.map((key) => ({
    key,
    type: "ltr",
    netToOwner: Math.round(row.netRevenue / 12),
  }));

  return {
    row,
    revenueAt100: scenarioData.revenueAt100,
    occupancyOptions: option.occupancyOptions,
    sparklineSeries: option.occupancyOptions.map((opt) => scenarioData.occupancy[opt]),
    monthlySeries,
  };
}

export default function Dashboard({ t, language, onToggleLanguage }) {
  const [selectedProject, setSelectedProject] = useState(DEFAULT_PROJECT_ID);
  const [selectedOption, setSelectedOption] = useState(DEFAULT_OPTION_ID);
  const [scenario, setScenario] = useState("base");
  const [occupancy, setOccupancy] = useState(() =>
    closestOccupancyOption(projects[DEFAULT_PROJECT_ID].options[DEFAULT_OPTION_ID].occupancyOptions, DEFAULT_OCCUPANCY_TARGET),
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const sectionRef = useRef(null);
  const exportRef = useRef(null);

  const project = projects[selectedProject];
  const option = project.options[selectedOption];

  // Switching projects can never leave the dashboard on an option/scenario
  // that project doesn't have, or an occupancy its grid doesn't tabulate -
  // every dependent selector is re-validated against the new project here.
  const handleProjectChange = useCallback((nextProjectId) => {
    const nextProject = projects[nextProjectId];

    setSelectedProject(nextProjectId);
    setSelectedOption((currentOption) => {
      const nextOptionKey = nextProject.options[currentOption] ? currentOption : Object.keys(nextProject.options)[0];
      const nextOption = nextProject.options[nextOptionKey];

      setScenario((currentScenario) =>
        nextOption.scenarios[currentScenario] ? currentScenario : Object.keys(nextOption.scenarios)[0],
      );
      setOccupancy((currentOccupancy) => closestOccupancyOption(nextOption.occupancyOptions, currentOccupancy));

      return nextOptionKey;
    });
  }, []);

  const handleOptionChange = useCallback(
    (nextOptionKey) => {
      const nextOption = project.options[nextOptionKey];
      setSelectedOption(nextOptionKey);
      setOccupancy((currentOccupancy) => closestOccupancyOption(nextOption.occupancyOptions, currentOccupancy));
    },
    [project],
  );

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === sectionRef.current);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    document.title =
      language === "ar" ? `مثوى - الدراسة المالية - ${project.name.ar}` : `Mathwaa - ${project.name.en} Financial Study`;
  }, [language, project]);

  const toggleFullscreen = useCallback(async () => {
    if (!sectionRef.current) return;
    try {
      if (document.fullscreenElement === sectionRef.current) {
        await document.exitFullscreen();
      } else {
        await sectionRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error("Failed to toggle fullscreen", error);
    }
  }, []);

  const snapshot = useMemo(() => getOptionSnapshot(option, scenario, occupancy), [option, scenario, occupancy]);

  const heroSubtitle = `${option.roomCount} ${t.units.rooms} · ${project.location[language]}`;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#151522" }}>
      <FloatingBackground />
      <Navbar
        t={t}
        language={language}
        selectedProject={selectedProject}
        onProjectChange={handleProjectChange}
        onToggleLanguage={onToggleLanguage}
      />
      <Hero t={t} title={project.name[language]} subtitle={heroSubtitle} />

      <main ref={sectionRef} className="max-w-7xl mx-auto px-6 pb-16" style={{ backgroundColor: isFullscreen ? "#151522" : "transparent" }}>
        <Toolbar
          t={t}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          exportTargetRef={exportRef}
          exportFileName={`${project.name.en}-Financial-Study`}
          showCompare={showCompare}
          onToggleCompare={() => setShowCompare((current) => !current)}
        />

        <div ref={exportRef}>
          {/* ---------------------------------------------------------------
              Market Overview: what a market/investor audience should see
              first - real market metrics only, no Mathwaa-internal figures.
          --------------------------------------------------------------- */}
          <SectionHeader eyebrow={t.sections.marketOverview} title={t.selectors.option} />
          <SelectorsRow
            t={t}
            option={selectedOption}
            onOptionChange={handleOptionChange}
            scenario={scenario}
            onScenarioChange={setScenario}
            occupancy={occupancy}
            onOccupancyChange={setOccupancy}
            occupancyOptions={snapshot.occupancyOptions}
          />

          {showCompare && (
            <ProjectComparisonCard t={t} language={language} optionKey={selectedOption} scenario={scenario} occupancy={occupancy} />
          )}

          <KPISection
            t={t}
            row={snapshot.row}
            sparklineSeries={snapshot.sparklineSeries}
            occupancy={occupancy}
            revenueAt100={snapshot.revenueAt100}
            unitCount={option.roomCount}
            operatingModel="ltr"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <OccupancyRing t={t} occupancy={occupancy} />
            <div className="lg:col-span-2">
              <RoomPricingTable t={t} roomPricing={option.roomPricing} scenario={scenario} />
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Mathwa Performance: internal, fee-adjusted figures - kept
              separate from the market overview above.
          --------------------------------------------------------------- */}
          <SectionHeader eyebrow={t.sections.mathwaPerformance} title={t.sections.mathwaPerformance} />
          <p className="text-xs mb-6 -mt-4" style={{ color: "#8b889c" }}>
            {t.sections.mathwaPerformanceSubtitle}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Suspense fallback={<SkeletonLoader height={240} />}>
              <RevenueDistributionDonut t={t} row={snapshot.row} />
            </Suspense>
            <OwnerEconomicsCard t={t} row={snapshot.row} />
          </div>

          <div className="mb-6">
            <Suspense fallback={<SkeletonLoader height={280} />}>
              <RevenueWaterfall t={t} row={snapshot.row} revenueAt100={snapshot.revenueAt100} />
            </Suspense>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<SkeletonLoader height={220} />}>
                <PortfolioSnapshot t={t} project={project} scenario={scenario} occupancy={occupancy} />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<SkeletonLoader height={240} />}>
                <OccupancySensitivity
                  t={t}
                  occupancyOptions={snapshot.occupancyOptions}
                  scenarioData={option.scenarios[scenario]}
                  selectedOccupancy={occupancy}
                />
              </Suspense>
            </div>
          </div>

          <div className="mb-6">
            <Suspense fallback={<SkeletonLoader height={280} />}>
              <SensitivityHeatmap t={t} model={option} activeScenario={scenario} activeOccupancy={occupancy} />
            </Suspense>
          </div>

          <div className="mb-6">
            <Suspense fallback={<SkeletonLoader height={260} />}>
              <CashFlowTimeline t={t} monthlySeries={snapshot.monthlySeries} isHybrid={false} />
            </Suspense>
          </div>

          {/* ---------------------------------------------------------------
              Investment Highlights: a closing executive summary for the
              acquisition-meeting audience - blends the market-facing gross
              figure with the owner-facing net figures already shown above,
              re-presented as a persuasive recap rather than new data.
          --------------------------------------------------------------- */}
          <SectionHeader eyebrow={t.sections.investmentHighlights} title={t.sections.investmentHighlights} />
          <InvestmentHighlights t={t} row={snapshot.row} />

          <ExecutiveClosing t={t} />
        </div>
      </main>
    </div>
  );
}
