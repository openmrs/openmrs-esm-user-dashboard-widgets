import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import ChartLoader from "./chart-loader.component";
import mockEsmAPI from "@openmrs/esm-api";

const mockChartData = {
  data: {
    rows: [
      {
        duration: "Jan2019",
        registrations: 20
      }
    ]
  }
};

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn().mockResolvedValueOnce(mockChartData)
}));

describe(`<ChartLoader />`, () => {
  const originalError = console.error;
  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
  });

  afterAll(() => {
    console.error = originalError;
  });

  afterEach(() => {
    mockEsmAPI.openmrsFetch.mockReset();
    cleanup();
  });

  it(`should render Loading message when widget is loading`, () => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockChartData);
    const { queryByText } = render(
      <ChartLoader
        config={{
          url:
            "/ws/rest/v1/reportingrest/reportdata/4abeb1a1-1e44-4f3e-b9e9-bb3333fda42c",
          reportName: "HSU Report",
          dataFields: "rows",
          xAxis: "duration",
          yAxis: "registrations",
          type: "LineChart",
          lineStroke: "",
          gridStroke: ""
        }}
      />
    );
    expect(queryByText("Loading...")).not.toBeNull();
  });
});
