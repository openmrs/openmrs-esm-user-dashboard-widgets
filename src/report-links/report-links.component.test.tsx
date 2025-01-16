import React from "react";
import { act } from "react-dom/test-utils";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import mockEsmAPI from "@openmrs/esm-api";
import ReportLinks from "./report-links.component";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

describe("Report Links", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  const commonWidgetProps = {
    locale: "en",
    showMessage: jest.fn()
  };

  const mockReports = [
    {
      name: "First Test Report",
      properties: {
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
      },
      type: "Chart"
    },
    {
      name: "Second Test Report",
      properties: {
        url: "/ws/rest/v1/reportingrest/reportdata/test-uuid-2",
        name: "Second Test Report",
        sourcePath: "dataSets.0.rows",
        columns: [
          {
            header: "Duration",
            cells: [
              {
                type: "label",
                styles: "regular",
                valueAccessor: "duration"
              }
            ]
          }
        ]
      },
      type: "Table"
    }
  ];

  const mockChartResponse = {
    uuid: "report-uuid",
    dataSets: [
      {
        uuid: "test-uuid",
        rows: [
          {
            Count: 2,
            "First Report X-Axis": "Feb 20"
          }
        ]
      }
    ]
  };

  const mockTableResponse = {
    uuid: "report-uuid",
    dataSets: [
      {
        uuid: "test-uuid-2",
        rows: [
          {
            duration: "feb 20"
          }
        ]
      }
    ]
  };

  const mockSessionData = {
    data: {
      rows: [
        {
          duration: "Jan2019",
          registrations: 20
        }
      ]
    }
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
    ).toHaveClass("svg-icon icon-external-link");
  });

  it("should show all report links", () => {
    const { queryByText } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    expect(queryByText("First Test Report")).toBeTruthy();
    expect(queryByText("Second Test Report")).toBeTruthy();
  });

  it("should not show chart modal during initial load", () => {
    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    expect(document.getElementsByClassName("ReactModalPortal")[0].innerHTML)
      .toBeEmpty;
    expect(
      document.getElementsByClassName("recharts-responsive-container").length
    ).toBe(0);
  });

  it("should show modal with chart when report link is clicked", async () => {
    mockEsmAPI.openmrsFetch.mockImplementation(url => {
      if (url === "/ws/rest/v1/session") {
        return Promise.resolve({ data: mockSessionData });
      }
      if (url === "reportUrl") {
        return Promise.resolve({ data: mockChartResponse });
      }
      return Promise.reject(new Error("Unexpected error"));
    });

    const { container, queryByText, getByRole } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
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

  it("should not show table modal during initial load", () => {
    const { container } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    expect(document.getElementsByClassName("ReactModalPortal")[0].innerHTML)
      .toBeEmpty;
    expect(
      document.getElementsByClassName("recharts-responsive-container").length
    ).toBe(0);
  });

  it("should show modal with table when report link is clicked", async () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce({
      data: mockTableResponse
    });
    const { container, queryByText, getByText, getByRole } = render(
      <ReportLinks
        {...commonWidgetProps}
        title="My Test Report Links"
        reports={mockReports}
      />
    );

    const secondReportLink = queryByText("Second Test Report");
    await act(async () => {
      secondReportLink.click();
    });

    expect(container.getElementsByClassName("ReactModalPortal")).toBeTruthy();
    expect(
      container.getElementsByClassName("recharts-responsive-container")
    ).toBeTruthy();
    expect(getByRole("dialog")).toBeTruthy();
  });
});
