import "./TilesPage.css";
import { FC, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { DateFilter } from "../components/DateFilter";
import { SourceBadge } from "../components/SourceBadge";
import { DataSource, getImportCategories, ImportCategory } from "../modules/api";
import { ROUTES } from "../Routes";

// TilesPage — страница «Плитка»: опубликованные категории импорта карточками
// в две колонки и фильтр по дате начала бытования типа.
const TilesPage: FC = () => {
  const [dateInput, setDateInput] = useState(""); // что введено в поле
  const [dateStart, setDateStart] = useState(""); // применённый фильтр
  const [categories, setCategories] = useState<ImportCategory[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Загрузка списка: при монтировании страницы и при каждом новом фильтре.
  // При размонтировании (уход со страницы) незавершённый запрос отменяется.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getImportCategories(dateStart, controller.signal)
      .then(({ data, source }) => {
        setCategories(data);
        setSource(source);
        setLoading(false);
      })
      .catch(() => undefined); // запрос отменён — состояние не меняем
    return () => controller.abort();
  }, [dateStart]);

  const handleReset = () => {
    setDateInput("");
    setDateStart("");
  };

  return (
    <div className="tilesPage">
      <header className="topBar">
        <span className="brand">Амфора</span>
        <SourceBadge source={source} />
      </header>

      <h1 className="tilesTitle">Категории импорта</h1>
      <p className="tilesLead">
        Опубликованные категории импортных находок. Даты бытования помогают
        восстановить время и направления торговых связей поселения.
      </p>

      <DateFilter
        value={dateInput}
        found={categories.length}
        isFiltered={dateStart !== ""}
        loading={loading}
        onChange={setDateInput}
        onSubmit={() => setDateStart(dateInput)}
        onReset={handleReset}
      />

      {loading && (
        <div className="tilesLoader">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="tilesEmpty">
          Ни одна категория не появляется раньше выбранной даты. Выберите более позднюю дату начала.
        </p>
      )}

      <Row xs={2} className="g-3">
        {categories.map((item) => (
          <Col key={item.id}>
            <CategoryCard
              title={item.title}
              imageUrl={item.image_url}
              period={item.period}
              likes={item.likes}
              onClick={() => navigate(`${ROUTES.FEED}/${item.id}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TilesPage;
