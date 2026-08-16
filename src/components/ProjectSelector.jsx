import { memo, useMemo } from "react";
import { Building } from "lucide-react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { projectOrder, projects } from "@/data/projects";

function ProjectSelector({ t, language, selectedProject, onProjectChange }) {
  const projectOptions = useMemo(
    () =>
      projectOrder.map((id) => ({
        value: id,
        label: projects[id].name[language],
      })),
    [language],
  );

  return (
    <div className="flex items-center gap-2">
      <Building size={13} style={{ color: "#9C99AE" }} className="hidden sm:block" aria-hidden="true" />
      <SegmentedControl
        layoutId="project-pill"
        size="sm"
        options={projectOptions}
        value={selectedProject}
        onChange={onProjectChange}
        label={t.selectors.project}
      />
    </div>
  );
}

export default memo(ProjectSelector);
