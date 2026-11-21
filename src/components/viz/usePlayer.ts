import { useEffect, useState } from "react";
import type { Frame } from "../../viz-data/types";

export function usePlayer(frames: Frame[], speed = 1200) {
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(false);
    const last = frames.length - 1;

    useEffect(() => {
        if (!playing) return;
        if (i >= last) return setPlaying(false);
        const t = setTimeout(() => setI((n) => n + 1), speed);
        return () => clearTimeout(t);
    }, [playing, i, last, speed]);

    return {
        frame: frames[i], i, total: frames.length, playing,
        play: () => { if (i >= last) setI(0); setPlaying(true); },
        pause: () => setPlaying(false),
        next: () => setI((n) => Math.min(n + 1, last)),
        prev: () => setI((n) => Math.max(n - 1, 0)),
        reset: () => { setPlaying(false); setI(0); },
    };
}