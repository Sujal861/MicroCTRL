import { TeamRevealGrid } from "@/components/ui/team-reveal-grid";

export function MeetTheTeam() {
  return (
    <TeamRevealGrid
      id="team"
      eyebrow="The people behind the build"
      title="Meet the team"
      description="Software, embedded systems, and hardware."
      className="min-h-0 border-t border-black/10 px-3 py-14 sm:min-h-[620px] sm:px-7 sm:py-12"
    />
  );
}
