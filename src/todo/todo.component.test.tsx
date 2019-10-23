import React from "react";
import Todo from "./todo.component";
import { render, cleanup } from "@testing-library/react";

describe(`<Todo />`, () => {
  const commonWidgetProps = { locale: "en" };

  afterEach(() => {
    cleanup();
  });

  it(`renders Todo without dying`, () => {
    render(<Todo showMessage={jest.fn()} {...commonWidgetProps} />);
  });

  it(`should render header component`, () => {
    const { getByText } = render(
      <Todo showMessage={jest.fn()} {...commonWidgetProps} />
    );
    expect(getByText("My To Do's")).toBeTruthy();
  });
});
