import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import Charts from "./charts.component";
import mockAPI from "@openmrs/esm-api";

const mockChartData = {
  data: {
    rows: [
      {
        duration: "Cool",
        registrations: 20
      }
    ]
  }
};

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn().mockResolvedValueOnce(mockChartData)
}));

describe(`<Charts />`, () => {
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
    const { queryByText, container } = render(
      <Charts
        title={"report"}
        charts={[
          {
            url: "someurl",
            reportName: "HSU Report",
            dataFields: "dataSets.metadata.rows",
            xAxis: "duration",
            yAxis: "registrations",
            type: "LineChart",
            lineStroke: "",
            gridStroke: ""
          }
        ]}
      />
    );
    expect(queryByText("report")).not.toBeNull();
    expect(queryByText("Loading...")).not.toBeNull();
    done();
  });
});
