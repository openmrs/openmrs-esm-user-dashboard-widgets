import React from "react";
import Todo from "./todo.component";
import { render, cleanup } from "@testing-library/react";

describe(`<Todo />`, () => {
  const commonWidgetProps = { locale: "en" };

  afterEach(() => {
    cleanup();
  });

  it(`renders Todo without dying`, () => {
    render(<Todo {...commonWidgetProps} />);
  });

  it(`should render header component`, () => {
    const { getByText } = render(<Todo {...commonWidgetProps} />);
    expect(getByText("My To Do's")).toBeTruthy();
  });
});
