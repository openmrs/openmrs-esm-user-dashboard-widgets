import React from "react";
import { act } from "react-dom/test-utils";
import {
  render,
  waitForElement,
  getByTitle,
  queryByTitle
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import mockEsmAPI from "@openmrs/esm-api";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

import ReportLinks from "./report-links";

describe("Report Links", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
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

  it("should request for new report when play button clicked", async () => {
    const mockReports = [
      {
        name: "First Test Report",
        uuid: "report-uuid"
      }
    ];

    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: { uuid: "report-request-uuid" }
    });

    const expectedRequestOptions = {
      method: "POST",
      body: {
        status: "REQUESTED",
        priority: "HIGHEST",
        reportDefinition: {
          parameterizable: { uuid: "report-uuid" }
        },
        renderingMode:
          "org.openmrs.module.reporting.web.renderers.DefaultWebRenderer"
      },
      headers: { "Content-Type": "application/json" }
    };

    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const firstReportLink = getByTitle(container, "Request Report");
    await act(async () => {
      firstReportLink.click();
    });

    const expectedReportRequestUrl = "/ws/rest/v1/reportingrest/reportRequest";

    expect(mockEsmAPI.openmrsFetch).toBeCalledWith(
      expectedReportRequestUrl,
      expectedRequestOptions
    );
  });

  it("should show loading spinner when report request is processing", async () => {
    const mockReports = [
      {
        name: "First Test Report",
        uuid: "report-uuid"
      }
    ];
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: { uuid: "report-request-uuid" }
    });

    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const firstReportLink = getByTitle(container, "Request Report");
    await act(async () => {
      firstReportLink.click();
    });

    expect(queryByTitle(container, "Report Request Processing")).toBeTruthy();
  });

  it("should show error message when view report clicked before report is rendered", async () => {
    const mockReports = [
      {
        name: "First Test Report",
        uuid: "report-uuid"
      }
    ];
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: { uuid: "report-request-uuid" }
    });

    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const firstReportViewReportLink = getByTitle(
      container,
      "Report not rendered yet"
    );
    await act(async () => {
      firstReportViewReportLink.click();
    });

    expect(commonWidgetProps.showMessage).toBeCalledWith({
      type: "error",
      message: (
        <span>
          No report available.
          <br /> Click{" "}
          <i className="icon-play" style={{ verticalAlign: "middle" }}></i> to
          request report.
        </span>
      )
    });
  });

  it("should open report results in tab when view report clicked after report rendered", async () => {
    const mockReports = [
      {
        name: "First Test Report",
        uuid: "report-uuid"
      }
    ];

    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: { uuid: "report-request-uuid" }
    });

    const expectedRequestOptions = {
      method: "POST",
      body: {
        status: "REQUESTED",
        priority: "HIGHEST",
        reportDefinition: {
          parameterizable: { uuid: "report-uuid" }
        },
        renderingMode:
          "org.openmrs.module.reporting.web.renderers.DefaultWebRenderer"
      },
      headers: { "Content-Type": "application/json" }
    };

    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const firstReportLink = getByTitle(container, "Request Report");
    await act(async () => {
      firstReportLink.click();
    });

    mockEsmAPI.openmrsFetch.mockResolvedValue({
      data: { status: "COMPLETED", uuid: "report-request-uuid" }
    });
    jest.runAllTimers();

    return waitForElement(() => getByTitle(container, "View Report")).then(
      () => {
        expect(getByTitle(container, "View Report")).toHaveAttribute(
          "href",
          "/openmrs/module/reporting/reports/viewReport.form?uuid=report-request-uuid"
        );
        expect(getByTitle(container, "View Report")).toHaveAttribute(
          "target",
          "new"
        );
      }
    );
  });
});
