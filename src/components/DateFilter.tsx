import "./DateFilter.css";
import { FC, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";

// Props фильтра: значение поля приходит от страницы, а изменения и нажатия
// кнопок сообщаются странице через функции обратного вызова.
interface DateFilterProps {
  value: string; // ГГГГ-ММ-ДД
  found: number; // сколько категорий найдено
  isFiltered: boolean; // применён ли фильтр (показывать «сбросить»)
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}

// DateFilter — фильтр по теме: дата начала бытования типа (год до н. э.).
export const DateFilter: FC<DateFilterProps> = ({
  value,
  found,
  isFiltered,
  loading,
  onChange,
  onSubmit,
  onReset,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // без перезагрузки страницы
    onSubmit();
  };

  return (
    <Form className="dateFilter" onSubmit={handleSubmit}>
      <Form.Label className="dateFilterLabel" htmlFor="date_start">
        Дата начала — не позднее
      </Form.Label>
      <div className="dateFilterRow">
        <Form.Control
          className="dateFilterInput"
          id="date_start"
          type="date"
          min="0001-01-01"
          max="9999-12-31"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button className="dateFilterButton" type="submit" disabled={loading}>
          Показать
        </Button>
      </div>
      <Form.Text className="dateFilterHint">
        Год в календаре — это год до нашей эры: 0500-01-01 читается как 500 г. до н. э.
      </Form.Text>
      <div className="dateFilterFound">
        <span>Найдено категорий: {found}</span>
        {isFiltered && (
          <Button variant="link" className="dateFilterReset" onClick={onReset}>
            сбросить фильтр
          </Button>
        )}
      </div>
    </Form>
  );
};
