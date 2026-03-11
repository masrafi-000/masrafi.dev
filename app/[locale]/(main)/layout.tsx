import { Footer } from "@/components/custom/footer";
import { Navbar } from "@/components/custom/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
