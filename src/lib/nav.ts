import {
    Braces, Sigma, Timer, Link2, Layers, ListOrdered,
    ArrowDownUp, Search, Share2, GitBranch,
    type LucideIcon,
} from "lucide-react";

export type Section = { slug: string; title: string };

export type Topic = {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    sections: Section[];
};

export const nav: Topic[] = [
    {
        slug: "linguagem-c", title: "Linguagem C", icon: Braces,
        description: "O fundamental: ponteiros, structs e memória.", sections: [
            {
                slug: "basico-para-estrutura-de-dados",
                title: "Básico para Estrutura de Dados"
            },
            {
                slug: "exercicios",
                title: "Exercícios"
            }
        ]
    },
    {
        slug: "notacao-assintotica", title: "Notação Assintótica", icon: Sigma,
        description: "O, Θ e Ω: como medir o crescimento de um algoritmo.", sections: [
            {
                slug: "o-que-sao",
                title: "O que são?"
            },
            {
                slug: "o",
                title: "O (ó)"
            },
            {
                slug: "theta",
                title: "Θ (theta)"
            },
            {
                slug: "omega",
                title: "Ω (ômega)"
            },
            {
                slug: "exercicios",
                title: "Exercícios"
            }
        ]
    },
    {
        slug: "tempo-de-execucao", title: "Tempo de Execução", icon: Timer,
        description: "Como contar operações e montar a função T(n).", sections: [
            {
                slug: "explicacao",
                title: "Explicação"
            },
            {
                slug: "exercicios",
                title: "Exercícios"
            }
        ]
    },
    {
        slug: "listas-ligadas", title: "Listas Ligadas", icon: Link2,
        description: "Nós ligados por ponteiros, como uma corrente.", sections: [
            { slug: "explicacao", title: "Explicação" },
            { slug: "complexidades", title: "Complexidades" },
            { slug: "exercicios", title: "Exercícios" },
        ]
    },
    {
        slug: "pilhas", title: "Pilhas", icon: Layers,
        description: "LIFO: o último a entrar é o primeiro a sair.", sections: [
            {
                slug: "pilha-com-vetor",
                title: "Pilha com Vetor"
            },
            {
                slug: "pilha-com-lista-ligada",
                title: "Pilha com Lista Ligada"
            },
            {
                slug: "exercicios",
                title: "Exercicios"
            }
        ]
    },
    {
        slug: "filas", title: "Filas", icon: ListOrdered,
        description: "FIFO: o primeiro a entrar é o primeiro a sair.", sections: [
            {
                slug: "fila-com-vetor",
                title: "Fila com Vetor"
            },
            {
                slug: "fila-com-lista-ligada",
                title: "Fila com Lista Ligada"
            },
            {
                slug: "exercicios",
                title: "Exercicios"
            }
        ]
    },
    {
        slug: "ordenacao", title: "Ordenação", icon: ArrowDownUp,
        description: "Inserção, seleção, merge sort e companhia.", sections: [
            {
                slug: "on2",
                title: "O(n²)"
            },
            {
                slug: "exercicios-on2",
                title: "Exercícios O(n²)"
            },
            {
                slug: "onlogn",
                title: "O(nlogn)"
            },
            {
                slug: "exercicios-onlogn",
                title: "Exercícios O(nlogn)"
            }
        ]
    },
    {
        slug: "buscas", title: "Buscas", icon: Search,
        description: "Busca sequencial e busca binária.", sections: [
            {
                slug: "busca-sequencial",
                title: "Busca Sequencial"
            },
            {
                slug: "busca-binaria",
                title: "Busca Binária",
            },
            {
                slug: "exercicios",
                title: "Exercícios"
            }
        ]
    },
    {
        slug: "grafos", title: "Grafos", icon: Share2,
        description: "O básico para entender árvores.", sections: [
            {
                slug: "basico-de-grafos",
                title: "Básico de Grafos"
            },
            {
                slug: "representacao-de-grafos",
                title: "Representação de Grafos"
            },
        ]
    },
    {
        slug: "arvores", title: "Árvores", icon: GitBranch,
        description: "Árvores normais, de busca e travessias.", sections: [
            {
                slug: "arvore-binaria",
                title: "Árvore Binária"
            },
            {
                slug: "arvore-binaria-de-busca",
                title: "Árvore Binária de Busca"
            },
            {
                slug: "percursos-em-arvores",
                title: "Percursos em Árvores"
            },
            {
                slug: "exercicios",
                title: "Exercícios"
            }
        ]
    },
];

export const findTopic = (slug: string) => nav.find((t) => t.slug === slug);

// Lista "achatada" de todas as páginas, na ordem da apostila
export const flatPages = nav.flatMap((topic) =>
    topic.sections.map((section) => ({
        topic,
        section,
        to: `/${topic.slug}/${section.slug}`,
    })),
);