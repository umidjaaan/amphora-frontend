import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import AddCategoryPage from "./pages/AddCategoryPage";
import FeedPage from "./pages/FeedPage";
import LoginPage from "./pages/LoginPage";
import TilesPage from "./pages/TilesPage";
import { ROUTES } from "./Routes";
import { store } from "./store";

// Роутинг: четыре страницы вложены в общий каркас с нижней панелью.
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.FEED} replace /> },
      { path: ROUTES.FEED, element: <FeedPage /> }, // первая услуга ленты
      { path: `${ROUTES.FEED}/:id`, element: <FeedPage /> }, // услуга по ид
      { path: ROUTES.TILES, element: <TilesPage /> },
      { path: ROUTES.ADD, element: <AddCategoryPage /> }, // только создателю
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: "*", element: <Navigate to={ROUTES.FEED} replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
