import React from "react";
import WidgetHeader from "./widget-header.component";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe(`<WidgetHeader />`, () => {
  it(`should render title based on props`, () => {
    const { queryByText } = render(
      <WidgetHeader title="Today's Appointments" />
    );

    expect(queryByText("Today's Appointments")).toBeTruthy();
  });

  it(`should render icon based on props`, () => {
    const { container } = render(
      <WidgetHeader title="Today's Appointments" icon="icon-test" />
    );

    expect(container.firstChild.firstChild).toHaveClass("icon-test");
  });
});
