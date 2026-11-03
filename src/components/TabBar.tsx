import "./TabBar.css";
import { FC, ReactNode } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS, RouteKey } from "../Routes";

// Пункт нижней панели: адрес, иконка и доступность для гостя.
interface TabItem {
  key: RouteKey;
  icon: ReactNode;
  enabled: boolean;
}

// В ЛР5 приложение работает для гостя: доступны только «Лента» и «Плитка».
// «Добавление» и «Вход» видны, но неактивны (появятся в ЛР6–ЛР7).
const TABS: TabItem[] = [
  {
    key: "FEED",
    enabled: true,
    icon: (
      <svg className="tabBarIcon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="M10 9.5v5l4.5-2.5z" className="icoFill" />
      </svg>
    ),
  },
  {
    key: "ADD",
    enabled: false,
    icon: (
      <svg className="tabBarIcon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    key: "TILES",
    enabled: true,
    icon: (
      <svg className="tabBarIcon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2" />
        <rect x="13" y="3.5" width="7.5" height="7.5" rx="2" />
        <rect x="3.5" y="13" width="7.5" height="7.5" rx="2" />
        <rect x="13" y="13" width="7.5" height="7.5" rx="2" />
      </svg>
    ),
  },
  {
    key: "LOGIN",
    enabled: false,
    icon: (
      <svg className="tabBarIcon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8.5" r="3.8" />
        <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
      </svg>
    ),
  },
];

// TabBar — нижняя навигационная панель из 4 пунктов (Navbar из React-Bootstrap).
export const TabBar: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Активный пункт определяем по адресу: лента — /import_categories/feed/...,
  // плитка — ровно /import_categories.
  const isActive = (key: RouteKey): boolean =>
    key === "FEED" ? pathname.startsWith(ROUTES.FEED) : pathname === ROUTES[key];

  return (
    <Navbar className="tabBar">
      <Nav className="tabBarNav" activeKey={pathname}>
        {TABS.map(({ key, icon, enabled }) => (
          <Nav.Link
            key={key}
            className={`tabBarItem${isActive(key) ? " tabBarItemActive" : ""}`}
            disabled={!enabled}
            onClick={() => enabled && navigate(ROUTES[key])}
          >
            {icon}
            <span>{ROUTE_LABELS[key]}</span>
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
};
