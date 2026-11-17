import "./TabBar.css";
import { FC, ReactNode } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutRequest } from "../modules/auth";
import { clearAuthToken } from "../modules/token";
import { resetImportCategories } from "../slices/importCategoriesSlice";
import { clearUser } from "../slices/userSlice";
import { ROUTES, ROUTE_LABELS, RouteKey } from "../Routes";

// Пункт нижней панели: адрес, иконка и доступность для гостя.
interface TabItem {
  key: RouteKey;
  icon: ReactNode;
  guest: boolean; // доступен ли гостю
}

// Гостю доступны «Лента», «Плитка» и «Вход»; после входа открывается
// «Добавление», а «Вход» превращается в «Выход».
const TABS: TabItem[] = [
  {
    key: "FEED",
    guest: true,
    icon: (
      <svg className="tabBarIcon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="M10 9.5v5l4.5-2.5z" className="icoFill" />
      </svg>
    ),
  },
  {
    key: "ADD",
    guest: false,
    icon: (
      <svg className="tabBarIcon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    key: "TILES",
    guest: true,
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
    guest: true,
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
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);

  // Активный пункт определяем по адресу: лента — /import_categories/feed/...,
  // плитка — ровно /import_categories.
  const isActive = (key: RouteKey): boolean =>
    key === "FEED" ? pathname.startsWith(ROUTES.FEED) : pathname === ROUTES[key];

  // Выход: запрос деавторизации через axios, затем вручную сбрасываем Redux:
  // пользователь становится гостем, фильтр и данные создателя очищаются.
  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // токен уже недействителен — всё равно выходим
    }
    clearAuthToken();
    dispatch(clearUser());
    dispatch(resetImportCategories());
    navigate(ROUTES.TILES);
  };

  const onTab = (key: RouteKey) => {
    if (key === "LOGIN" && isAuthenticated) {
      void logout();
      return;
    }
    navigate(ROUTES[key]);
  };

  return (
    <Navbar className="tabBar">
      <Nav className="tabBarNav" activeKey={pathname}>
        {TABS.map(({ key, icon, guest }) => (
          <Nav.Link
            key={key}
            className={`tabBarItem${isActive(key) ? " tabBarItemActive" : ""}`}
            disabled={!guest && !isAuthenticated}
            onClick={() => onTab(key)}
          >
            {icon}
            <span>{key === "LOGIN" && isAuthenticated ? "Выход" : ROUTE_LABELS[key]}</span>
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
};
