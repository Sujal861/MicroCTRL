import { useEffect, type RefObject } from "react";

export function useOutsideClick(ref: RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !ref.current || ref.current.contains(target)) return;
      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}
