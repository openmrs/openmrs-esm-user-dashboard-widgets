import React from "react";
import Charts from "./charts.component";
import { render, cleanup } from "@testing-library/react";

describe(`<Todo />`, () => {
  const commonWidgetProps = { language: "en" };
  afterEach(() => {
    cleanup();
  });

  it(`renders Todo without dying`, () => {
    render(<Charts {...commonWidgetProps} />);
  });

  it(`should render header component`, () => {
    const { getByText } = render(<Charts {...commonWidgetProps} />);
    expect(getByText("Reports")).toBeTruthy();
  });
});
