import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-mono text-6xl font-bold text-brand-500">404</p>
      <p className="mt-4 text-ink-400">Essa página não existe. 😕</p>
      <Link to="/" className="mt-6 inline-block font-mono text-sm text-brand-300 hover:underline">
        ← Voltar ao início
      </Link>
    </div>
  );
}