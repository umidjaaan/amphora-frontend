import "./AppLayout.css";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { TabBar } from "./components/TabBar";

// AppLayout — общий каркас: узкая колонка «телефона», страница
// (подставляется роутером в Outlet) и нижняя панель навигации.
export const AppLayout: FC = () => (
  <div className="appShell">
    <main className="appContent">
      <Outlet />
    </main>
    <TabBar />
  </div>
);
