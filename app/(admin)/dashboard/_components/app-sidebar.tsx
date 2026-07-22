"use client";

import * as React from "react";
import {
  FileText,
  FolderGit2,
  LayoutDashboard,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { NavMain, type NavItem } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const navItems: NavItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderGit2,
  },
  {
    title: "Blog",
    url: "/dashboard/blog",
    icon: FileText,
  },
  {
    title: "Messages",
    url: "/dashboard/contact",
    icon: Mail,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border/40 py-3">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm transition-transform group-hover:scale-105">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-bold tracking-tight text-foreground">
              Masrafi.dev
            </span>
            <span className="truncate text-xs text-muted-foreground font-medium">
              Admin Portal
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
