import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import Charts from "./charts.component";

describe(`<Charts />`, () => {
  const originalError = console.error;
  beforeAll(() => {
    setErrorFilter(originalError, /Warning.*not wrapped in act/);
  });

  afterAll(() => {
    console.error = originalError;
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the report name`, () => {
    const { queryByText } = render(
      <Charts
        title={"report"}
        charts={[
          {
            url:
              "/ws/rest/v1/reportingrest/reportdata/4abeb1a1-1e44-4f3e-b9e9-bb3333fda42c",
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
  });
});
