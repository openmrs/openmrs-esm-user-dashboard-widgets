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

  it(`should redirect to provider specific view all when clicked`, () => {
    const { queryByText } = render(
      <WidgetFooter
        viewAllUrl="/test/url/to/view-all/?provider=%provider%"
        context={{
          locale: "",
          showMessage: () => {},
          provider: "test-provider"
        }}
      />
    );

    expect(queryByText("View All").parentElement.getAttribute("href")).toBe(
      "/test/url/to/view-all/?provider=test-provider"
    );
  });
});
