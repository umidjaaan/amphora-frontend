import "./TilesPage.css";
import { FC, useEffect, useState } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CategoryCard } from "../components/CategoryCard";
import { DateFilter } from "../components/DateFilter";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { SourceBadge } from "../components/SourceBadge";
import { useAppDispatch, useAppSelector } from "../hooks";
import { deleteImportCategory, fetchImportCategories, setDateStart } from "../slices/importCategoriesSlice";
import { ROUTES } from "../Routes";

// TilesPage — страница «Плитка»: опубликованные категории импорта карточками
// в две колонки и фильтр по дате начала. Фильтр хранится в Redux, поэтому
// сохраняется при переходах между страницами и сбрасывается при выходе.
const TilesPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dateStart, list, listSource, loading, error } = useAppSelector((state) => state.importCategories);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const [dateInput, setDateInput] = useState(dateStart); // что введено в поле

  // Загрузка списка через thunk: при открытии страницы, при новом фильтре,
  // при входе и выходе пользователя (меняется признак is_creator).
  useEffect(() => {
    dispatch(fetchImportCategories());
  }, [dispatch, dateStart, isAuthenticated]);

  // фильтр мог сброситься при выходе — синхронизируем поле
  useEffect(() => setDateInput(dateStart), [dateStart]);

  const handleReset = () => {
    setDateInput("");
    dispatch(setDateStart(""));
  };

  return (
    <div className="tilesPage">
      <LoadingOverlay show={loading} />
      <header className="topBar">
        <span className="brand">Амфора</span>
        <SourceBadge source={listSource} />
      </header>

      <h1 className="tilesTitle">Категории импорта</h1>
      <p className="tilesLead">
        Опубликованные категории импортных находок. Даты бытования помогают
        восстановить время и направления торговых связей поселения.
      </p>

      <DateFilter
        value={dateInput}
        found={list.length}
        isFiltered={dateStart !== ""}
        loading={loading}
        onChange={setDateInput}
        onSubmit={() => dispatch(setDateStart(dateInput))}
        onReset={handleReset}
      />

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && list.length === 0 && !error && (
        <p className="tilesEmpty">
          Ни одна категория не появляется раньше выбранной даты. Выберите более позднюю дату начала.
        </p>
      )}

      <Row xs={2} className="g-3">
        {list.map((item) => (
          <Col key={item.id}>
            <CategoryCard
              title={item.title}
              imageUrl={item.image_url}
              period={item.period}
              likes={item.likes}
              onClick={() => navigate(`${ROUTES.FEED}/${item.id}`)}
              onDelete={
                isAuthenticated && item.is_creator === 1
                  ? () => dispatch(deleteImportCategory(item.id))
                  : undefined
              }
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TilesPage;
