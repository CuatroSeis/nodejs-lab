import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Play, School, BookOpen, Flame, Settings, Activity, FileCode } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ruta", label: "Ruta de aprendizaje", icon: School },
  { to: "/estadisticas", label: "Estadísticas / Progreso", icon: Activity },
  { to: "/conceptos", label: "Biblioteca de conceptos", icon: BookOpen },
  { to: "/proyectos", label: "Proyectos integradores", icon: FileCode },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" aria-label="Navegación principal del laboratorio de Node.js">
      <div className="sidebar-brand">
        <div className="brand">Node<span>.</span>Lab</div>
        <div className="sidebar-version">v0.1.0</div>
      </div>

      <nav className="sidebar-nav" aria-label="Secciones principales">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              aria-current={isActive ? "page" : undefined}
              className={({ isActive: active }) =>
                `sidebar-item ${active ? "sidebar-item-active" : ""}`
              }
            >
              <Icon className="sidebar-icon" size={18} strokeWidth={2} />
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item" title="Ajustes" aria-label="Abrir ajustes">
          <Settings className="sidebar-icon" size={18} strokeWidth={2} />
          <span className="sidebar-label">Ajustes</span>
        </button>
      </div>
    </aside>
  );
}
