import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { setErrorFilter } from "../utils";
import TableLoader from "./table-loader.component";
import mockEsmAPI from "@openmrs/esm-api";

const tableConfig = {
  name: "HSU Report",
  properties: {
    url: "reportUrl",
    name: "HSU Report",
    sourcePath: "rows",
    columns: [
      {
        header: "Duration",
        cells: [
          {
            type: "label",
            styles: "regular",
            valueAccessor: "registrations"
          }
        ]
      }
    ]
  },
  type: "Table"
};

const mockTableData = {
  columns: ["registrations"]
};

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn().mockResolvedValueOnce(mockTableData)
}));

describe("Table Loader component", () => {
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

  it(`should render Loading message when table is loading`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockTableData);
    const { queryByText } = render(
      <TableLoader {...commonWidgetProps} config={mockTableData} />
    );
    expect(queryByText("Loading...")).not.toBeNull();
    done();
  });

  it(`should render react table when table is loading`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockTableData);
    const { container } = render(
      <TableLoader {...commonWidgetProps} config={mockTableData} />
    );

    expect(container.getElementsByClassName("ReactModalPortal")).toBeTruthy();
    expect(container.getElementsByClassName("ReactTable")).toBeTruthy();
    done();
  });

  it(`should show error message when unable to fetch table data.`, done => {
    mockEsmAPI.openmrsFetch.mockReturnValue(
      Promise.reject(new Error("Unexpected error"))
    );

    const { queryByText } = render(
      <TableLoader {...commonWidgetProps} config={tableConfig} />
    );

    waitForElement(() => queryByText("Unable to load table HSU Report")).then(
      () => {
        expect(queryByText("Unable to load table HSU Report")).not.toBeNull();
        done();
      }
    );
  });
});
