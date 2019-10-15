import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../../utils";
import LineChart from "./line-chart.component";

describe(`<Linechart />`, () => {
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

  it(`should render responsive container`, () => {
    const { container } = render(
      <LineChart
        data={[
          {
            registrations: 2,
            duration: "Jan2019"
          }
        ]}
        yAxis={"registrations"}
        xAxis={"duration"}
        lineStroke={"#ddd"}
        gridStroke={"#aaa"}
      />
    );
    expect(container.firstChild).toHaveClass("recharts-responsive-container");
  });

  //@TODO: should write test : should render Line Chart
});
