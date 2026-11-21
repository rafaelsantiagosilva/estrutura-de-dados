import { useEffect, useState } from "react";

export function usePlayer(total: number, speedMs = 1200) {
    const [i, setI] = useState(0);
    const [playing, setPlaying] = useState(false);
    const last = total - 1;

    // enquanto estiver tocando, avança um frame a cada `speedMs`
    useEffect(() => {
        if (!playing || i >= last) return;
        const t = setTimeout(() => setI((n) => n + 1), speedMs);
        return () => clearTimeout(t);
    }, [playing, i, last, speedMs]);

    return {
        i,
        playing: playing && i < last,
        play: () => {
            if (i >= last) setI(0); // terminou? recomeça
            setPlaying(true);
        },
        pause: () => setPlaying(false),
        next: () => { setPlaying(false); setI((n) => Math.min(n + 1, last)); },
        prev: () => { setPlaying(false); setI((n) => Math.max(n - 1, 0)); },
        goTo: (n: number) => { setPlaying(false); setI(n); },
        reset: () => { setPlaying(false); setI(0); },
    };
}