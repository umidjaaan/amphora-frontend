import "./FormPage.css";
import { FC, FormEvent, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { useAppDispatch } from "../hooks";
import { errorMessage, loginRequest, registerRequest } from "../modules/auth";
import { setAuthToken } from "../modules/token";
import { setUser } from "../slices/userSlice";
import { ROUTES } from "../Routes";

// LoginPage — страница «Аутентификация»: вход и регистрация.
// Запросы идут через axios (modules/auth.ts), результат вручную
// передаётся в Redux действием setUser — без кодогенерации и thunk.
const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    const result = await loginRequest(login, password);
    setAuthToken(result.access_token); // JWT: в память и в localStorage
    dispatch(setUser(result.user)); // интерфейс переключается на создателя
    navigate(ROUTES.TILES);
  };

  const run = async (action: () => Promise<void>, fallback: string) => {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(errorMessage(e, fallback));
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void run(signIn, "Неверный логин или пароль");
  };

  const handleRegister = () =>
    void run(async () => {
      await registerRequest(login, password);
      await signIn();
    }, "Не удалось зарегистрироваться");

  return (
    <div className="formPage">
      <LoadingOverlay show={loading} />
      <header className="topBar">
        <span className="brand">Амфора</span>
      </header>
      <h1 className="formTitle">Вход</h1>
      <p className="formLead">Войдите, чтобы добавлять категории импорта, удалять свои категории и ставить лайки.</p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login">
          <Form.Label className="formLabel">Логин</Form.Label>
          <Form.Control
            className="formInput"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoComplete="username"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label className="formLabel">Пароль</Form.Label>
          <Form.Control
            className="formInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" className="formPrimary" disabled={loading}>
          Войти
        </Button>
        <Button variant="link" className="formSecondary" disabled={loading || !login || !password} onClick={handleRegister}>
          Зарегистрироваться
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
