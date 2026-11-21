import { Navigate, Route, Routes, useParams } from "react-router-dom";
import DocLayout from "./components/layout/DocLayout";
import HomePage from "./pages/HomePage";
import DocPage from "./pages/DocPage";
import NotFound from "./pages/NotFound";
import { findTopic } from "./lib/nav";

// /listas-encadeadas  →  /listas-encadeadas/explicacao
function TopicRedirect() {
  const { topic } = useParams();
  const found = findTopic(topic ?? "");
  if (!found) return <NotFound />;
  return <Navigate to={`/${found.slug}/${found.sections[0].slug}`} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Rota "pai" sem path: só fornece a moldura (layout) */}
      <Route element={<DocLayout />}>
        <Route index element={<HomePage />} />
        <Route path=":topic" element={<TopicRedirect />} />
        <Route path=":topic/:section" element={<DocPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}