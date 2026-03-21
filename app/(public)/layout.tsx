import { BottomNav } from "@/components/public/BottomNav";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] pb-24 pt-32 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
