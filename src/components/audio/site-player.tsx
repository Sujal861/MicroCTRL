"use client";

import { MusicPlayer } from "@/components/ui/music-player";

export function SitePlayer() {
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <MusicPlayer
        tracks={[]}
        youtubePlaylistId="PL4fGSI1pDJn6puJdseH2Rt9sMvt9E2M4i"
        randomPool={10}
        playOnScrollPast="hero"
        accentColor="#ffffff"
      />
    </div>
  );
}
