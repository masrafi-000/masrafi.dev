"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FolderGit2,
  Mail,
  Plus,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/authClient";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Admin";

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      description: "Active portfolio items",
      icon: FolderGit2,
      change: "+2 this month",
      color: "text-blue-500 bg-blue-500/10",
      link: "/dashboard/projects",
    },
    {
      title: "Blog Articles",
      value: "8",
      description: "Published tech posts",
      icon: FileText,
      change: "+1 this week",
      color: "text-emerald-500 bg-emerald-500/10",
      link: "/dashboard/blog",
    },
    {
      title: "Contact Messages",
      value: "5",
      description: "Inquiries received",
      icon: Mail,
      change: "3 unread",
      color: "text-amber-500 bg-amber-500/10",
      link: "/dashboard/contact",
    },
    {
      title: "System Status",
      value: "100%",
      description: "All services operational",
      icon: ShieldCheck,
      change: "Optimal",
      color: "text-purple-500 bg-purple-500/10",
      link: "#",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-linear-to-r from-primary/10 via-background to-accent/20 border border-border/50 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Here is an overview of your portfolio performance and admin metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="font-semibold shadow-xs">
            <Link href="/dashboard/projects">
              <Plus className="w-4 h-4 mr-1.5" /> New Project
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="font-semibold">
            <Link href="/" target="_blank">
              View Live Site <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/40 shadow-xs hover:border-primary/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center justify-between pt-1">
                <span>{stat.description}</span>
                <span className="font-medium text-foreground/80">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-border/40 shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Management</CardTitle>
            <CardDescription>
              Direct links to manage your portfolio contents
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/dashboard/projects"
              className="group flex flex-col justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/40 hover:border-primary/40 transition-all"
            >
              <div className="space-y-2">
                <FolderGit2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground text-sm">Manage Projects</h3>
                <p className="text-xs text-muted-foreground">
                  Add, edit, or remove featured works
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                Go to Projects <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            <Link
              href="/dashboard/blog"
              className="group flex flex-col justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/40 hover:border-primary/40 transition-all"
            >
              <div className="space-y-2">
                <FileText className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground text-sm">Blog Articles</h3>
                <p className="text-xs text-muted-foreground">
                  Publish tech articles & thoughts
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-emerald-500">
                Go to Blog <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>

            <Link
              href="/dashboard/contact"
              className="group flex flex-col justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/40 hover:border-primary/40 transition-all"
            >
              <div className="space-y-2">
                <Mail className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground text-sm">Contact Messages</h3>
                <p className="text-xs text-muted-foreground">
                  View messages from visitors
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-amber-500">
                Go to Messages <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Admin Privileges</CardTitle>
            <CardDescription>Account status and session details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 space-y-1">
              <div className="text-xs text-muted-foreground font-medium">Logged in as</div>
              <div className="text-sm font-bold text-foreground">{session?.user?.email || "smmasrafi01@gmail.com"}</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Full administrator access granted.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
