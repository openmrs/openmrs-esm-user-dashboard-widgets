import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import ChartLoader from "./chart-loader.component";
import mockEsmAPI from "@openmrs/esm-api";

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn()
}));

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

const mockSessionData = {
  data: {
    sessionLocation: {
      uuid: "uuid"
    }
  }
};

describe(`<ChartLoader />`, () => {
  const commonWidgetProps = { locale: "en" };
  const originalError = console.error;

  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
    mockEsmAPI.openmrsFetch.mockReset();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render Loading message when chart is loading`, done => {
    mockEsmAPI.openmrsFetch.mockImplementation(url => {
      if (url === "/ws/rest/v1/session") {
        return Promise.resolve({ data: mockSessionData });
      }
      if (url === "reportUrl") {
        return Promise.resolve({ data: mockChartData });
      }
      return Promise.reject(new Error("Unexpected error"));
    });
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

  // In order to fix this an update to the "@testing-library/react" is required and will brok other tests.
  it.skip(`should show error message when unable to fetch chart data.`, done => {
    mockEsmAPI.openmrsFetch.mockImplementation(url => {
      if (url === "/ws/rest/v1/session") {
        return Promise.resolve({ data: mockSessionData });
      }
      return Promise.reject(new Error("Unexpected error"));
    });

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
