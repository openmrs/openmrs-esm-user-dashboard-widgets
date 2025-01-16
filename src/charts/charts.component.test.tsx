import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import Charts from "./charts.component";
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
    rows: [
      {
        duration: "Jan2019",
        registrations: 20
      }
    ]
  }
};

describe(`<Charts />`, () => {
  const commonWidgetProps = { locale: "en" };
  const originalError = console.error;
  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
    mockEsmAPI.openmrsFetch.mockReset();
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it(`should render the line chart with title`, done => {
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
      <Charts
        {...commonWidgetProps}
        title={"report"}
        charts={[
          {
            url: "reportUrl",
            name: "HSU Report",
            sourcePath: "rows",
            xAxis: "duration",
            yAxis: "registrations",
            type: "LineChart"
          }
        ]}
        showMessage={jest.fn()}
      />
    );
    expect(queryByText("report")).not.toBeNull();
    expect(queryByText("Loading...")).not.toBeNull();
    done();
  });
});
