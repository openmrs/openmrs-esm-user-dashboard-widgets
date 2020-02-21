import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
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
  const commonWidgetProps = { locale: "en" };
  const originalError = console.error;
  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
    mockEsmAPI.openmrsFetch.mockReset();
  });

  afterAll(() => {
    console.error = originalError;
    mockEsmAPI.openmrsFetch.mockReset();
  });

  afterEach(() => {
    mockEsmAPI.openmrsFetch.mockReset();
    cleanup();
  });

  it(`should render Loading message when chart is loading`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockChartData);
    const { queryByText } = render(
      <ChartLoader
        {...commonWidgetProps}
        config={{
          url: "reportUrl",
          name: "HSU Report",
          sourcePath: "rows",
          xAxis: "duration",
          yAxis: "registrations",
          type: "LineChart"
        }}
      />
    );
    expect(queryByText("Loading...")).not.toBeNull();
    done();
  });

  it(`should show error message when unable to fetch chart data.`, done => {
    mockEsmAPI.openmrsFetch.mockReturnValue(
      Promise.reject(new Error("Unexpected error"))
    );

    const { queryByText } = render(
      <ChartLoader
        {...commonWidgetProps}
        config={{
          url: "reportUrl",
          name: "HSU Report",
          sourcePath: "rows",
          xAxis: "duration",
          yAxis: "registrations",
          type: "LineChart"
        }}
      />
    );

    waitForElement(() => queryByText("Unable to load Chart HSU Report")).then(
      () => {
        expect(queryByText("Unable to load Chart HSU Report")).not.toBeNull();
        done();
      }
    );
  });
});
