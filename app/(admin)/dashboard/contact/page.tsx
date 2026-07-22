import { Mail } from "lucide-react";

export default function ContactAdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">
          View and respond to messages submitted via the portfolio contact form.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center gap-3 bg-card/50">
        <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg">Inbox & Inquiries</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Submitted visitor messages and contact requests will be managed here.
        </p>
      </div>
    </div>
  );
}
