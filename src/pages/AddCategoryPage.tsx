import "./FormPage.css";
import { FC, FormEvent, useEffect, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { useAppDispatch, useAppSelector } from "../hooks";
import { imageOrDefault } from "../modules/defaults";
import {
  clearError,
  createImportCategory,
  deleteImportCategory,
  fetchDraft,
  publishImportCategory,
} from "../slices/importCategoriesSlice";
import { ROUTES } from "../Routes";

// AddCategoryPage — страница «Добавление категории» в два шага:
// шаг 1 «Далее» — название, фото и видео (создаётся черновик);
// шаг 2 «Опубликовать» — даты начала и конца бытования и описание.
const AddCategoryPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const { draft, loading, error } = useAppSelector((state) => state.importCategories);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | undefined>();
  const [video, setVideo] = useState<File | undefined>();
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [description, setDescription] = useState("");

  // при открытии загружаем черновик: если он есть, сразу шаг 2
  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) dispatch(fetchDraft());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  const handleNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(createImportCategory({ title, image, video }));
  };

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const result = await dispatch(
      publishImportCategory({ id: draft.id, date_start: dateStart, date_end: dateEnd, description }),
    );
    if (publishImportCategory.fulfilled.match(result)) navigate(`${ROUTES.FEED}/${draft.id}`);
  };

  return (
    <div className="formPage">
      <LoadingOverlay show={loading} />
      <header className="topBar">
        <span className="brand">Амфора</span>
        <span className="formStep">Шаг {draft ? 2 : 1} из 2</span>
      </header>
      <h1 className="formTitle">Новая категория</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {!draft ? (
        <Form key="step1" onSubmit={handleNext}>
          <p className="formLead">Название, фото и видео находки. После «Далее» создаётся черновик.</p>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label className="formLabel">Название</Form.Label>
            <Form.Control className="formInput" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label className="formLabel">Фото (JPG, PNG, WEBP)</Form.Label>
            <Form.Control
              className="formInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage((e.target as HTMLInputElement).files?.[0])}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="video">
            <Form.Label className="formLabel">Видео (MP4, WEBM)</Form.Label>
            <Form.Control
              className="formInput"
              type="file"
              accept="video/*"
              onChange={(e) => setVideo((e.target as HTMLInputElement).files?.[0])}
            />
          </Form.Group>
          <Button type="submit" className="formPrimary" disabled={loading || !title}>
            Далее
          </Button>
        </Form>
      ) : (
        <Form key="step2" onSubmit={handlePublish}>
          <div className="draftCard">
            <img src={imageOrDefault(draft.image_url)} alt={draft.title} />
            <div>
              <div className="draftLabel">Черновик №{draft.id}</div>
              <div className="draftTitle">{draft.title}</div>
            </div>
          </div>
          <Form.Group className="mb-3" controlId="date_start">
            <Form.Label className="formLabel">Дата начала (год до н. э.)</Form.Label>
            <Form.Control className="formInput" type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="date_end">
            <Form.Label className="formLabel">Дата конца (год до н. э.)</Form.Label>
            <Form.Control className="formInput" type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-4" controlId="description">
            <Form.Label className="formLabel">Описание</Form.Label>
            <Form.Control
              className="formInput"
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="formPrimary" disabled={loading}>
            Опубликовать
          </Button>
          <Button
            variant="link"
            className="formSecondary formDanger"
            disabled={loading}
            onClick={() => dispatch(deleteImportCategory(draft.id))}
          >
            Удалить черновик
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AddCategoryPage;
