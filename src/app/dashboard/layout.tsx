import { NavBar } from "@/components/nav-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">{children}</div>
      <NavBar />
    </div>
  );
}
