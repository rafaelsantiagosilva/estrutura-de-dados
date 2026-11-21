import { NavLink } from "react-router-dom";
import type { Topic } from "../../lib/nav";

export default function SectionTabs({ topic }: { topic: Topic }) {
  return (
    <nav aria-label="Seções" className="flex gap-1 overflow-x-auto border-b border-ink-600">
      {topic.sections.map((s) => (
        <NavLink
          key={s.slug}
          to={`/${topic.slug}/${s.slug}`}
          className={({ isActive }) =>
            `-mb-px whitespace-nowrap border-b-2 px-4 py-2 font-mono text-sm transition-colors ${
              isActive
                ? "border-brand-500 text-white"
                : "border-transparent text-ink-400 hover:text-ink-200"
            }`
          }
        >
          {s.title}
        </NavLink>
      ))}
    </nav>
  );
}