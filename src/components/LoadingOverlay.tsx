import "./LoadingOverlay.css";
import { FC } from "react";
import { Spinner } from "react-bootstrap";

// LoadingOverlay — анимация загрузки поверх страницы: пока идёт запрос,
// полупрозрачный слой перекрывает страницу и блокирует кнопки.
export const LoadingOverlay: FC<{ show: boolean }> = ({ show }) =>
  show ? (
    <div className="loadingOverlay" role="status" aria-live="polite">
      <Spinner animation="border" />
    </div>
  ) : null;
