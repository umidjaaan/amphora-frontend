import "./CategoryCard.css";
import { FC, SyntheticEvent } from "react";
import { Button, Card } from "react-bootstrap";
import { DEFAULT_IMAGE, imageOrDefault } from "../modules/defaults";

// Props карточки: данные одной услуги и обработчик нажатия.
interface CategoryCardProps {
  title: string;
  imageUrl: string | null;
  period: string | null;
  likes: number;
  onClick: () => void;
  onDelete?: () => void; // есть только у своих категорий создателя
}

// Если файл по ссылке не загрузился (MinIO не запущен, файла нет) —
// тоже показываем изображение по умолчанию.
const setDefaultImage = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  if (!img.src.endsWith(DEFAULT_IMAGE)) img.src = DEFAULT_IMAGE;
};

// CategoryCard — карточка категории импорта на странице «Плитка».
export const CategoryCard: FC<CategoryCardProps> = ({ title, imageUrl, period, likes, onClick, onDelete }) => (
  <Card className="categoryCard" onClick={onClick}>
    <div className="categoryCardMedia">
      <Card.Img
        className="categoryCardImg"
        variant="top"
        src={imageOrDefault(imageUrl)}
        alt={title}
        loading="lazy"
        onError={setDefaultImage}
      />
    </div>
    <Card.Body className="categoryCardBody">
      <Card.Title className="categoryCardTitle">{title}</Card.Title>
      <div className="categoryCardFoot">
        <span className="categoryCardLikes">&#9825; {likes}</span>
        <span className="categoryCardPeriod">{period ?? "даты не указаны"}</span>
      </div>
      {onDelete && (
        <Button
          size="sm"
          variant="outline-danger"
          className="categoryCardDelete"
          onClick={(event) => {
            event.stopPropagation(); // не открывать ленту
            onDelete();
          }}
        >
          Удалить
        </Button>
      )}
    </Card.Body>
  </Card>
);
