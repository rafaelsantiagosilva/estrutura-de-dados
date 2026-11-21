import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

export default function DocLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // ao trocar de página, volta ao topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <TopBar onMenu={() => setMenuOpen(true)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* lg:pl-72 = espaço reservado para a sidebar fixa (w-72) */}
      <main className="pt-14 lg:pl-72">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
          <Outlet /> {/* ← a página da rota aparece aqui */}
        </div>
      </main>
    </div>
  );
}