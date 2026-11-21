import { useRef, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";

export default function Pre(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(ref.current?.textContent ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative">
      <button
        onClick={copy}
        aria-label="Copiar código"
        className="absolute right-3 top-3 z-10 rounded-md border border-ink-600 bg-ink-800 p-1.5 text-ink-400 opacity-0 transition hover:text-white group-hover:opacity-100"
      >
        {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
      </button>
      <pre ref={ref} {...props} />
    </div>
  );
}