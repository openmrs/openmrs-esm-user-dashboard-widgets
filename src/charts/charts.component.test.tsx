import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import Charts from "./charts.component";
import mockAPI from "@openmrs/esm-api";

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

describe(`<Charts />`, () => {
  const commonWidgetProps = { locale: "en" };
  const originalError = console.error;
  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
    mockAPI.openmrsFetch.mockReset();
  });

  afterAll(() => {
    console.error = originalError;
  });

  afterEach(() => {
    mockAPI.openmrsFetch.mockReset();
    cleanup();
  });

  it(`should render the line chart with title`, done => {
    mockAPI.openmrsFetch.mockResolvedValueOnce(mockChartData);
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
