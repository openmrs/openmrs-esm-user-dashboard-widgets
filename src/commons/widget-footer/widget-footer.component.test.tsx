import React from "react";
import WidgetFooter from "./widget-footer.component";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe(`<WidgetFooter />`, () => {
  it(`should view all button`, () => {
    const { queryByText } = render(
      <WidgetFooter viewAllUrl="/test/url/to/view-all" />
    );

    expect(queryByText("View All")).toBeTruthy();
  });

  it(`should not show view all button when viewall url is not given`, () => {
    const { queryByText } = render(<WidgetFooter />);

    expect(queryByText("View All")).toBeFalsy();
  });
});
