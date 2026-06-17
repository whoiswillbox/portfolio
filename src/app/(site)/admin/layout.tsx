import { ContentCard } from "@/components/content-card";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ContentCard className="h-full overflow-auto p-6">{children}</ContentCard>;
}
