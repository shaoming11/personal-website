import { ExtraSections } from "@/components/extra-sections"
import { ProfileHeader } from "@/components/profile-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { WorkGrid } from "@/components/work-grid"

export default function Page() {
  return (
    <main id="about" className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
      <div className="lg:grid lg:grid-cols-[160px_1fr] lg:gap-12">
        <SidebarNav />
        <div className="mt-10 lg:mt-0">
          <ProfileHeader />
          <WorkGrid />
          <ExtraSections />
          <footer className="mt-24 border-t border-border pt-8 text-sm text-muted-foreground">
            built by shaoming wu ·{" "} inspo from shayaan azeem
          </footer>
        </div>
      </div>
    </main>
  )
}
