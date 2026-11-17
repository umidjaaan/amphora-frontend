import "./FeedPage.css";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { SourceBadge } from "../components/SourceBadge";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchFeedItem, likeImportCategory } from "../slices/importCategoriesSlice";
import { DEFAULT_IMAGE, DEFAULT_VIDEO, imageOrDefault, videoOrDefault } from "../modules/defaults";
import { ROUTES } from "../Routes";

// Видео не загрузилось — показываем видео по умолчанию.
const setDefaultVideo = (event: SyntheticEvent<HTMLVideoElement>) => {
  const video = event.currentTarget;
  if (!video.src.endsWith(DEFAULT_VIDEO)) video.src = DEFAULT_VIDEO;
};

// Фото не загрузилось — показываем изображение по умолчанию.
const setDefaultImage = (event: SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  if (!img.src.endsWith(DEFAULT_IMAGE)) img.src = DEFAULT_IMAGE;
};

// FeedPage — страница «Лента»: одна категория на весь экран с видео,
// описание раскрывается кнопкой «Ещё», кнопка «След.» — следующая категория.
const FeedPage: FC = () => {
  const { id } = useParams<{ id?: string }>(); // /import_categories/feed/:id
  const dispatch = useAppDispatch();
  const { feedItem: item, feedSource: source, loading, error } = useAppSelector((state) => state.importCategories);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Загрузка категории через thunk при открытии страницы и при смене ид в адресе.
  useEffect(() => {
    setExpanded(false);
    dispatch(fetchFeedItem(id ? Number(id) : undefined));
  }, [dispatch, id, isAuthenticated]);

  if (!item) {
    return (
      <div className="feedLoader">
        {error ? <Alert variant="danger">{error}</Alert> : <Spinner animation="border" />}
      </div>
    );
  }

  return (
    <div className="feed">
      <LoadingOverlay show={loading} />
      {/* фото под видео: видно, пока видео загружается */}
      <img
        key={`img-${item.id}`}
        className="feedVideo"
        src={imageOrDefault(item.image_url)}
        alt={item.title}
        onError={setDefaultImage}
      />
      <video
        key={item.id}
        className="feedVideo"
        src={videoOrDefault(item.video_url)}
        autoPlay
        muted
        loop
        playsInline
        onError={setDefaultVideo}
      />
      <div className="feedShade" />

      <header className="feedTop">
        <span className="brand">Амфора</span>
        <span className="feedCounter">
          {item.position} / {item.total}
        </span>
      </header>
      <div className="feedSource">
        <SourceBadge source={source} />
      </div>

      <aside className="rail">
        {/* лайк ставит только авторизованный пользователь, гостю — только счётчик */}
        <button
          type="button"
          className={`railAction railActionLike${item.is_liked ? " railActionLiked" : ""}`}
          disabled={!isAuthenticated || loading}
          title={isAuthenticated ? "Лайк" : "Войдите, чтобы поставить лайк"}
          onClick={() => dispatch(likeImportCategory({ id: item.id, like: item.is_liked ? 0 : 1 }))}
        >
          <svg className="railIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20.5 4.2 13a4.6 4.6 0 0 1 6.5-6.5l1.3 1.3 1.3-1.3A4.6 4.6 0 0 1 19.8 13z" />
          </svg>
          <span>{item.likes}</span>
        </button>
        <button
          type="button"
          className="railAction railActionNext"
          disabled={loading}
          onClick={() => navigate(`${ROUTES.FEED}/${item.next_id}`)}
        >
          <svg className="railIcon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v9M8.5 13l3.5 3.5 3.5-3.5" />
          </svg>
          <span>След.</span>
        </button>
      </aside>

      <section className={`feedInfo${expanded ? " feedInfoExpanded" : ""}`}>
        <h1 className="feedTitle">{item.title}</h1>
        <p className="feedPeriod">
          {item.period ?? "даты не указаны"} · автор: {item.creator.login}
        </p>
        <p className="feedDesc">{item.description}</p>
        <Button variant="link" className="feedMore" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Свернуть" : "Ещё"}
        </Button>
      </section>
    </div>
  );
};

export default FeedPage;
