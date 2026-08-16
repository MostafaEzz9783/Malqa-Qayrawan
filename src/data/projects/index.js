import { malqaProject } from "@/data/projects/malqa";
import { qayrawanProject } from "@/data/projects/qayrawan";

// Adding a third project means adding one entry here (plus its own data
// module) - nothing else in the dashboard references a project by name.
export const projects = {
  malqa: malqaProject,
  qayrawan: qayrawanProject,
};

export const projectOrder = ["malqa", "qayrawan"];
export const DEFAULT_PROJECT_ID = "malqa";
export const DEFAULT_OPTION_ID = "option1";

export default projects;
