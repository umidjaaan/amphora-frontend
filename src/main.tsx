import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import FeedPage from "./pages/FeedPage";
import TilesPage from "./pages/TilesPage";
import { ROUTES } from "./Routes";

// Роутинг: обе страницы вложены в общий каркас с нижней панелью.
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.FEED} replace /> },
      { path: ROUTES.FEED, element: <FeedPage /> }, // первая услуга ленты
      { path: `${ROUTES.FEED}/:id`, element: <FeedPage /> }, // услуга по ид
      { path: ROUTES.TILES, element: <TilesPage /> },
      { path: "*", element: <Navigate to={ROUTES.FEED} replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
