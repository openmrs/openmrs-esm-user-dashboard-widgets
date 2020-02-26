import React from "react";
import { act } from "react-dom/test-utils";
import {
  render,
  waitForElement,
  getByTitle,
  queryByTitle,
  getByText
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import mockEsmAPI from "@openmrs/esm-api";
import { Trans } from "react-i18next";

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

  const mockCharts = [
    {
      url: "/ws/rest/v1/reportingrest/reportdata/test-uuid",
      name: "First Test Report",
      sourcePath: "dataSets.0.rows",
      xAxis: "First Report X-Axis",
      yAxis: [
        {
          field: "Count",
          color: "#4286f4"
        }
      ],
      type: "LineChart"
    }
  ];

  const mockResponse = {
    uuid: "report-uuid",
    dataSets: [
      {
        uuid: "55e08df6-fe1f-4ca2-a830-841056cdf851",
        rows: [
          {
            Count: 2,
            "First Report X-Axis": "Feb 20"
          }
        ]
      }
    ]
  };

  it("should show header with given name", () => {
    const { queryByText, getByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        charts={[]}
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
        charts={[]}
      />
    );

    expect(
      getByText("My Test Report Links").parentElement.firstChild
    ).toHaveClass("svg-icon icon-external-link");
  });

  it("should show all report links", () => {
    const { queryByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        charts={mockCharts}
      />
    );

    expect(queryByText("First Test Report")).toBeTruthy();
  });

  it("should not show chart modal during initial load", () => {
    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        charts={mockCharts}
      />
    );

    expect(document.getElementsByClassName("ReactModalPortal")[0].innerHTML)
      .toBeEmpty;
    expect(
      document.getElementsByClassName("recharts-responsive-container").length
    ).toBe(0);
  });

  it("should show modal with chart when report link is clicked", async () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: mockResponse
    });
    const { container, queryByText, getByText, getByRole } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        charts={mockCharts}
      />
    );

    const firstReportLink = queryByText("First Test Report");
    await act(async () => {
      firstReportLink.click();
    });

    expect(container.getElementsByClassName("ReactModalPortal")).toBeTruthy();
    expect(
      container.getElementsByClassName("recharts-responsive-container")
    ).toBeTruthy();
    expect(getByRole("dialog")).toBeTruthy();
  });
});
