"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MusicTrack {
  title: string;
  artist: string;
  src: string;
  artwork?: string;
}

export interface MusicPlayerProps {
  tracks: MusicTrack[];
  avatar?: string;
  startIndex?: number;
  autoPlay?: boolean;
  loop?: boolean;
  defaultCollapsed?: boolean;
  showProgress?: boolean;
  accentColor?: string;
  onTrackChange?: (track: MusicTrack, index: number) => void;
  className?: string;
  /** YouTube playlist id. When set, tracks play from that playlist in shuffle order. */
  youtubePlaylistId?: string;
  /** YouTube search used as the playlist. Search embeds are deprecated. */
  youtubeSearch?: string;
  /** Play a random entry from the first N items. Used for the global top songs. */
  randomPool?: number;
  /** Element id. Playback starts after this element scrolls off, and pauses when it returns. */
  playOnScrollPast?: string;
}

const EQ_BARS = [0, 1, 2, 3];
const EQ_KEYFRAMES =
  "@keyframes vengeance-eq{0%,100%{transform:scaleY(0.28)}50%{transform:scaleY(1)}}";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setShuffle: (shuffle: boolean) => void;
  setLoop: (loop: boolean) => void;
  getPlaylist: () => string[] | null;
  getPlaylistIndex: () => number;
  cueVideoById: (videoId: string) => void;
  playVideoAt: (index: number) => void;
  cuePlaylist: (options: { listType?: string; list?: string; index?: number; startSeconds?: number }) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData: () => { title?: string; author?: string; video_id?: string };
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      height?: string;
      width?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
        onError?: (event: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number; CUED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function clampIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return new Promise<YTNamespace>((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
    }
  });
}

export function MusicPlayer({
  tracks,
  avatar,
  startIndex = 0,
  autoPlay = false,
  loop = true,
  defaultCollapsed = false,
  showProgress = true,
  accentColor,
  onTrackChange,
  className,
  youtubePlaylistId,
  youtubeSearch,
  randomPool,
  playOnScrollPast,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const ytRef = useRef<YTPlayer | null>(null);
  const scrollSyncRef = useRef<() => void>(() => {});
  const [index, setIndex] = useState(() => clampIndex(startIndex, tracks.length));
  const [isPlaying, setIsPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ytMeta, setYtMeta] = useState<MusicTrack>({
    title: youtubeSearch || randomPool ? "Top 10 worldwide" : "Playlist",
    artist: "YouTube",
    src: "",
  });

  const shouldPlayRef = useRef(autoPlay);
  const onTrackChangeRef = useRef(onTrackChange);
  useEffect(() => {
    onTrackChangeRef.current = onTrackChange;
  }, [onTrackChange]);

  const youtubeMode = Boolean(youtubePlaylistId || youtubeSearch);
  const fileTrack = tracks[index];
  const track = youtubeMode ? ytMeta : fileTrack;

  useEffect(() => {
    if (youtubeMode) return;
    const audio = audioRef.current;
    if (!audio || !fileTrack) return;
    audio.src = fileTrack.src;
    audio.load();
    onTrackChangeRef.current?.(fileTrack, index);
    if (shouldPlayRef.current) {
      audio.play().catch(() => {});
    }
  }, [fileTrack, index, youtubeMode]);

  const picksRandom = Boolean(youtubeSearch || randomPool);

  const playRandomTop = useCallback((player: YTPlayer) => {
    const list = player.getPlaylist?.() || [];
    if (list.length === 0) {
      player.playVideo();
      return;
    }
    const pool = Math.min(randomPool || 10, list.length);
    player.playVideoAt(Math.floor(Math.random() * pool));
  }, [randomPool]);

  useEffect(() => {
    if (!youtubeMode || !hostRef.current) return;
    let cancelled = false;
    let timer = 0;

    const sync = (player: YTPlayer) => {
      const data = player.getVideoData();
      const videoId = data.video_id;
      const nextTrack: MusicTrack = {
        title: data.title || (picksRandom ? "Top 10 worldwide" : "Playlist"),
        artist: data.author || "YouTube",
        src: "",
        artwork: videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined,
      };
      setYtMeta(nextTrack);
      setCurrentTime(player.getCurrentTime?.() || 0);
      setDuration(player.getDuration?.() || 0);
      onTrackChangeRef.current?.(nextTrack, 0);
    };

    let embedSkips = 0;

    const pastHero = () => {
      if (!playOnScrollPast) return true;
      const hero = document.getElementById(playOnScrollPast);
      if (!hero) return true;
      return hero.getBoundingClientRect().bottom < window.innerHeight * 0.12;
    };

    loadYouTubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;
      const player = new YT.Player(hostRef.current, {
        height: "200",
        width: "200",
        playerVars: {
          listType: youtubeSearch ? "search" : "playlist",
          list: youtubeSearch || youtubePlaylistId || "",
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            const target = event.target;
            ytRef.current = target;
            if (!picksRandom) target.setShuffle(true);
            target.setLoop(loop);
            target.pauseVideo();
            sync(target);
            scrollSyncRef.current();
            timer = window.setInterval(() => {
              if (!ytRef.current) return;
              setCurrentTime(ytRef.current.getCurrentTime() || 0);
              const nextDuration = ytRef.current.getDuration() || 0;
              if (nextDuration) setDuration(nextDuration);
            }, 500);
          },
          onStateChange: (event) => {
            const playing = event.data === YT.PlayerState.PLAYING;
            if (playing && !shouldPlayRef.current && !pastHero()) {
              event.target.pauseVideo();
              return;
            }
            setIsPlaying(playing);
            if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.CUED) {
              sync(event.target);
            }
            if (event.data === YT.PlayerState.ENDED && loop) {
              if (picksRandom) playRandomTop(event.target);
              else event.target.nextVideo();
            }
          },
          onError: (event) => {
            const blocked = event.data === 5 || event.data === 100 || event.data === 101 || event.data === 150;
            if (!blocked || embedSkips >= 15) return;
            embedSkips += 1;
            const player = event.target;
            const list = player.getPlaylist?.() || [];
            const index = (player.getPlaylistIndex?.() ?? -1) + 1;
            if (list.length > index) {
              if (pastHero()) player.playVideoAt(index);
              else player.cueVideoById(list[index]);
              return;
            }
            if (pastHero()) player.nextVideo();
          },
        },
      });
      ytRef.current = player;
    });

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      ytRef.current?.destroy?.();
      ytRef.current = null;
    };
  }, [loop, picksRandom, playOnScrollPast, playRandomTop, youtubeMode, youtubePlaylistId, youtubeSearch]);

  useEffect(() => {
    if (!playOnScrollPast) return;
    const hero = document.getElementById(playOnScrollPast);
    if (!hero) return;
    const unlocked = { current: false };
    const wasPast = { current: false };

    const syncScroll = () => {
      const past = hero.getBoundingClientRect().bottom < window.innerHeight * 0.12;
      const player = ytRef.current;
      if (!unlocked.current || !player) return;
      if (!past) {
        shouldPlayRef.current = false;
        player.pauseVideo();
        wasPast.current = false;
        return;
      }
      shouldPlayRef.current = true;
      if (!wasPast.current && picksRandom) playRandomTop(player);
      else player.playVideo();
      wasPast.current = true;
    };

    const unlock = (event: PointerEvent) => {
      unlocked.current = true;
      const target = event.target;
      if (target instanceof Element && target.closest("[data-music-player]")) return;
      syncScroll();
    };

    scrollSyncRef.current = syncScroll;
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("pointerdown", unlock);
    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("pointerdown", unlock);
    };
  }, [picksRandom, playOnScrollPast, playRandomTop]);

  const play = useCallback(() => {
    shouldPlayRef.current = true;
    if (ytRef.current) ytRef.current.playVideo();
    else audioRef.current?.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    shouldPlayRef.current = false;
    if (ytRef.current) ytRef.current.pauseVideo();
    else audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const next = useCallback(() => {
    shouldPlayRef.current = true;
    if (ytRef.current) {
      if (picksRandom) playRandomTop(ytRef.current);
      else ytRef.current.nextVideo();
      return;
    }
    if (tracks.length === 0) return;
    setIndex((i) => (i + 1) % tracks.length);
  }, [picksRandom, playRandomTop, tracks.length]);

  const prev = useCallback(() => {
    shouldPlayRef.current = true;
    if (ytRef.current) {
      ytRef.current.previousVideo();
      return;
    }
    if (tracks.length === 0) return;
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const handleEnded = useCallback(() => {
    if (!loop && index === tracks.length - 1) {
      shouldPlayRef.current = false;
      setIsPlaying(false);
      return;
    }
    next();
  }, [index, loop, next, tracks.length]);

  const seek = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!Number.isFinite(duration) || duration === 0) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const seconds = Math.min(Math.max(ratio, 0), 1) * duration;
      if (ytRef.current) ytRef.current.seekTo(seconds, true);
      else if (audioRef.current) audioRef.current.currentTime = seconds;
    },
    [duration],
  );

  if ((!youtubeMode && (tracks.length === 0 || !fileTrack)) || !track) return null;

  const accent = accentColor ?? "#000000";
  const artwork = track.artwork ?? avatar;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      data-music-player
      className={cn(
        "relative select-none text-white transition-[width] duration-700 ease-out",
        collapsed ? "w-[188px]" : "w-[min(420px,90vw)]",
        className,
      )}
    >
      <style>{EQ_KEYFRAMES}</style>
      {youtubeMode ? (
        <div ref={hostRef} className="pointer-events-none absolute left-0 top-0 h-[200px] w-[320px] opacity-0" />
      ) : (
        <audio
          ref={audioRef}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={handleEnded}
        />
      )}

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand player" : "Collapse player"}
        aria-expanded={!collapsed}
        className="absolute -right-3 -top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black text-white"
      >
        {collapsed ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </button>

      {artwork ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artwork}
          alt=""
          className="absolute -top-5 left-0 z-20 h-20 w-20 rounded-xl object-cover shadow-lg ring-1 ring-white/20"
        />
      ) : null}

      <div className="relative flex h-[70px] items-center gap-3 overflow-hidden rounded-xl border border-white/15 bg-black pl-24 pr-5">
        <div className="flex h-8 shrink-0 items-end gap-[3px]" aria-hidden="true">
          {EQ_BARS.map((bar) => (
            <span
              key={bar}
              className="block w-[3px] rounded-full"
              style={{
                height: "100%",
                background: accent,
                transformOrigin: "bottom",
                animation: `vengeance-eq ${0.9 + bar * 0.18}s ease-in-out infinite`,
                animationPlayState: isPlaying ? "running" : "paused",
                transform: isPlaying ? undefined : "scaleY(0.28)",
              }}
            />
          ))}
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 transition-opacity duration-300",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold uppercase tracking-wide">{track.title}</div>
            <div className="truncate text-[0.65rem] uppercase tracking-[0.2em] text-white/50">{track.artist}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={prev} aria-label="Previous track" className="rounded-full p-1.5">
              <SkipBack className="h-4 w-4 fill-current" />
            </button>
            <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="rounded-full p-1.5">
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
            <button type="button" onClick={next} aria-label="Next track" className="rounded-full p-1.5">
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>
        </div>
        {showProgress && !collapsed ? (
          <div
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration) || 0}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            tabIndex={0}
            onClick={seek}
            className="absolute inset-x-0 bottom-0 flex h-3 cursor-pointer items-end"
          >
            <div className="relative h-[3px] w-full bg-white/15">
              <div className="absolute inset-y-0 left-0" style={{ width: `${progress}%`, background: accent }} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MusicPlayer;
