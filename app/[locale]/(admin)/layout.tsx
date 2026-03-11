export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar Placeholder */}
      <aside className="w-64 border-r bg-muted/20 p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>Nav Item 1</p>
          <p>Nav Item 2</p>
        </nav>
      </aside>
      
      {/* Admin Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-lg font-semibold">Admin Area</h1>
        </header>
        <div className="p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
