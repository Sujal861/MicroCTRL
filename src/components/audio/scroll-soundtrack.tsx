"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "microctrl-muted";
const MUTE_EVENT = "microctrl-mute";

function subscribe(onStoreChange: () => void) {
  window.addEventListener(MUTE_EVENT, onStoreChange);
  return () => window.removeEventListener(MUTE_EVENT, onStoreChange);
}

function getMuted() {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function ScrollSoundtrack() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const unlocked = useRef(false);
  const muted = useSyncExternalStore(subscribe, getMuted, () => false);

  useEffect(() => {
    const audio = audioRef.current;
    const hero = document.getElementById("hero");
    if (!audio || !hero) return;
    audio.loop = true;

    const sync = () => {
      const pastHero = hero.getBoundingClientRect().bottom < window.innerHeight * 0.12;
      if (!unlocked.current) return;
      if (muted || !pastHero) {
        audio.pause();
        audio.volume = 0;
        return;
      }
      audio.volume = 0.45;
      void audio.play().catch(() => {
        unlocked.current = false;
      });
    };

    const unlock = () => {
      unlocked.current = true;
      sync();
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("pointerdown", unlock);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("pointerdown", unlock);
    };
  }, [muted]);

  function toggleMute() {
    sessionStorage.setItem(STORAGE_KEY, muted ? "0" : "1");
    window.dispatchEvent(new Event(MUTE_EVENT));
    unlocked.current = true;
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/scroll.mp3" preload="metadata" />
      <button
        type="button"
        onClick={toggleMute}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute soundtrack" : "Mute soundtrack"}
        title="Soundtrack plays after the hero"
        className="glass-chip fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center text-black sm:bottom-5 sm:right-5"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </>
  );
}
