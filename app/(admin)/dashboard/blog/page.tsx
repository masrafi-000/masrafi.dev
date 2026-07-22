import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, publish, and edit technical blog posts.
          </p>
        </div>
        <Button className="font-semibold shadow-xs">
          <Plus className="w-4 h-4 mr-2" /> Write New Post
        </Button>
      </div>

      <div className="rounded-xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center gap-3 bg-card/50">
        <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg">Blog Articles</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Published tech articles and drafts will appear here.
        </p>
      </div>
    </div>
  );
}
