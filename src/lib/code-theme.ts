// src/lib/code-theme.ts
import type { ThemeRegistration } from "shiki";

export const codeTheme: ThemeRegistration = {
    name: "ink-blue",
    type: "dark",

    // Cores do "editor" (fundo e texto padrão do bloco de código)
    colors: {
        "editor.background": "#0a0f1a",
        "editor.foreground": "#c9d3e4",
    },

    // Cada regra: quais "escopos" (tipos de token) recebem qual cor
    tokenColors: [
        // 💬 Comentários
        {
            scope: ["comment", "punctuation.definition.comment"],
            settings: { foreground: "#6b7c99", fontStyle: "italic" },
        },

        // 🔷 Palavras-chave: struct, typedef, while, for, if, else, return
        {
            scope: [
                "keyword",
                "keyword.control",
                "storage.type.struct",
                "storage.type.c",
                "storage.modifier",
            ],
            settings: { foreground: "#62a0ff" },
        },

        // 🧱 Tipos: int, void, No, Lista
        {
            scope: [
                "entity.name.type",
                "storage.type",
                "support.type",
                "support.class",
            ],
            settings: { foreground: "#7dd3fc" },
        },

        // ⚙️ Funções: malloc, printf, newNo, addInicio
        {
            scope: [
                "entity.name.function",
                "support.function",
                "meta.function-call",
            ],
            settings: { foreground: "#9cc4ff" },
        },

        // 🔢 Números e constantes: 0, 1, NULL
        {
            scope: [
                "constant.numeric",
                "constant.language",
                "support.constant",
            ],
            settings: { foreground: "#fbbf24" },
        },

        // 🔤 Strings: "[", ", ", "Fora dos limites\n"
        {
            scope: ["string", "punctuation.definition.string"],
            settings: { foreground: "#7ee2b8" },
        },

        // ↩️ Escapes e formatadores dentro da string: \n, %d
        {
            scope: [
                "constant.character.escape",
                "constant.other.placeholder",
            ],
            settings: { foreground: "#fbbf24" },
        },

        // 📎 Pré-processador: #include, <stdio.h>
        {
            scope: [
                "meta.preprocessor",
                "keyword.control.directive",
                "string.quoted.other.lt-gt.include",
            ],
            settings: { foreground: "#c4b5fd" },
        },

        // ➡️ Operadores: ->, =, ==, !=, *, ++
        {
            scope: ["keyword.operator", "punctuation.accessor"],
            settings: { foreground: "#62a0ff" },
        },

        // 🏷️ Variáveis e campos: li, aux, valor, prox, ini
        {
            scope: ["variable", "variable.other.member", "variable.parameter"],
            settings: { foreground: "#c9d3e4" },
        },

        // ✂️ Pontuação: ; , { } ( )
        {
            scope: ["punctuation", "meta.brace"],
            settings: { foreground: "#8a9bb8" },
        },
    ],
};