import { Sidebar } from "@/components/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-1 flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
