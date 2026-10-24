import { PageShell, SectionsNav } from "@/components/site-header"

// Experience and projects share this shell so the header and tabs stay mounted
// when switching between them; only the page content below swaps.
export default function SectionsLayout({ children }: { children: React.ReactNode }) {
  return <PageShell nav={<SectionsNav />}>{children}</PageShell>
}
