import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import { useParams } from "react-router-dom";
import type { MDXProps } from "mdx/types";
import { mdxComponents } from "../components/mdx";
import SectionTabs from "../components/layout/SectionTabs";
import PrevNext from "../components/layout/PrevNext";
import NotFound from "./NotFound";
import { findTopic } from "../lib/nav";

type MdxModule = { default: ComponentType<MDXProps> };

// Mapa: caminho do arquivo → função que o importa sob demanda
const pages = import.meta.glob<MdxModule>("../content/**/*.mdx");

// 🧠 Um lazy por arquivo, criado UMA vez (fora do componente)
const cache = new Map<string, LazyExoticComponent<ComponentType<MDXProps>>>();

function getPage(path: string) {
  const loader = pages[path];
  if (!loader) return null;
  if (!cache.has(path)) cache.set(path, lazy(loader));
  return cache.get(path)!;
}

export default function DocPage() {
  const { topic: topicSlug = "", section: sectionSlug = "" } = useParams();
  const topic = findTopic(topicSlug);
  const section = topic?.sections.find((s) => s.slug === sectionSlug);

  if (!topic || !section) return <NotFound />;

  const Icon = topic.icon;
  const pageKey = `${topicSlug}/${sectionSlug}`;
  const Content = getPage(`../content/${pageKey}.mdx`);

  return (
    <>
      <header className="mb-8">
        <p className="flex items-center gap-2 font-mono text-sm text-brand-400">
          <Icon className="size-4" /> {topic.slug}
        </p>
        <h1 className="mb-6 mt-2 font-mono text-4xl font-bold text-white">{topic.title}</h1>
        <SectionTabs topic={topic} />
      </header>

      <article className="prose max-w-none prose-headings:scroll-mt-20 prose-headings:font-mono">
        {Content ? (
          // 🔑 key = página atual → trocar de aba remonta tudo do zero
          <Suspense key={pageKey} fallback={<p className="font-mono text-ink-400">Carregando…</p>}>
            <Content components={mdxComponents} />
          </Suspense>
        ) : (
          <div className="not-prose rounded-card border border-dashed border-ink-600 p-8 text-center">
            <p className="text-3xl">🚧</p>
            <p className="mt-2 font-mono text-white">Conteúdo em construção</p>
            <p className="mt-1 text-sm text-ink-400">
              Crie o arquivo{" "}
              <code className="font-mono text-brand-300">src/content/{pageKey}.mdx</code>
              <br />
              (se ele já existe, reinicie o <code className="font-mono">npm run dev</code>)
            </p>
          </div>
        )}
      </article>

      <PrevNext />
    </>
  );
}