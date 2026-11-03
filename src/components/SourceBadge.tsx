import { FC } from "react";
import { Badge } from "react-bootstrap";
import { DataSource } from "../modules/api";

// SourceBadge — откуда пришли данные: с веб-сервиса или из mock-объектов.
export const SourceBadge: FC<{ source: DataSource }> = ({ source }) => (
  <Badge pill bg={source === "mock" ? "warning" : "success"} text="dark" className="sourceBadge">
    {source === "mock" ? "mock-данные" : "веб-сервис"}
  </Badge>
);
