import React from "react";
import { cleanup, render, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import ReportLinks from "./report-links";

describe("Report Links", () => {
  const commonWidgetProps = {
    locale: "en",
    showMessage: jest.fn()
  };

  it("should show header with given name", () => {
    const { queryByText, getByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={[]}
      />
    );

    expect(queryByText("My Test Report Links")).toBeTruthy();
    expect(getByText("My Test Report Links").parentElement).toHaveClass(
      "widget-header"
    );
  });

  it("should show header icon", () => {
    const { getByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={[]}
      />
    );

    expect(
      getByText("My Test Report Links").parentElement.firstChild
    ).toHaveClass("icon-todo");
  });

  it("should show all report links", () => {
    const mockReports = [
      { name: "First Test Report", link: "first-test-report-link" }
    ];
    const { queryByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    expect(queryByText("First Test Report")).toBeTruthy();
  });

  it("should open the report in new tab when report link clicked", () => {
    const mockReports = [
      { name: "First Test Report", link: "first-test-report-link" }
    ];
    const { getByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const reportLink = getByText("First Test Report");
    expect(reportLink).toHaveProperty(
      "href",
      "http://localhost/first-test-report-link"
    );
    expect(reportLink).toHaveProperty("target", "_blank");
  });
});
