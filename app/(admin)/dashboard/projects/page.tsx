import { FolderGit2 } from "lucide-react";
import { CreateProjectDialog } from "./_components/create-project-dialog";

export default function ProjectsAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage, edit, and organize your portfolio project items.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="rounded-xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center gap-3 bg-card/50">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <FolderGit2 className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg">Portfolio Projects</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Projects and case studies will be displayed here for management.
        </p>
      </div>
    </div>
  );
}
