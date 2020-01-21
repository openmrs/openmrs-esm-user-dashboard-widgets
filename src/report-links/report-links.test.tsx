import React from "react";
import { cleanup, render, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import mockEsmAPI from "@openmrs/esm-api";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

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
      {
        name: "First Test Report",
        uuid: "report-uuid"
      }
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

  it("should open the report in new tab when report link clicked", done => {
    const mockReports = [
      {
        name: "First Test Report",
        uuid: "report-uuid"
      }
    ];

    mockEsmAPI.openmrsFetch.mockResolvedValue({
      data: { uuid: "report-request-uuid" }
    });

    const expectedRequestOptions = {
      method: "POST",
      body: {
        status: "REQUESTED",
        priority: "NORMAL",
        reportDefinition: {
          parameterizable: { uuid: "report-uuid" }
        },
        renderingMode:
          "org.openmrs.module.reporting.web.renderers.DefaultWebRenderer"
      },
      headers: { "Content-Type": "application/json" }
    };

    window.open = jest.fn();

    const { getByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const firstReportLink = getByText("First Test Report");
    firstReportLink.click();

    const expectedReportRequestUrl = "/ws/rest/v1/reportingrest/reportRequest";

    expect(mockEsmAPI.openmrsFetch).toBeCalledWith(
      expectedReportRequestUrl,
      expectedRequestOptions
    );

    const expectedViewReportUrl =
      "/openmrs/module/reporting/reports/viewReport.form?uuid=report-request-uuid";
    setTimeout(() => {
      expect(window.open).toBeCalledWith(expectedViewReportUrl, "_blank");
      done();
    }, 0);
  });
});
