import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { codeTheme } from "./code-theme";

let instance: Promise<HighlighterCore> | null = null;

// Cria o highlighter uma única vez e reaproveita em todas as simulações
export function getHighlighter() {
    instance ??= createHighlighterCore({
        themes: [codeTheme],
        langs: [import("shiki/langs/c.mjs")],
        engine: createJavaScriptRegexEngine(),
    });
    return instance;
}