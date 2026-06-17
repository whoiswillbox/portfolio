import { ContentCard } from "@/components/content-card";
import { PlaylistSkeleton } from "@/components/music-skeletons";

// Shown instantly on navigation while the server component fetches the
// playlist from Spotify, so the move feels immediate instead of blocking.
export default function Loading() {
  return (
    <ContentCard className="h-full overflow-auto">
      <PlaylistSkeleton />
    </ContentCard>
  );
}
