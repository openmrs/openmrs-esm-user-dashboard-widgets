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

const mockTableResponse = {
  uuid: "report-uuid",
  dataSets: [
    {
      uuid: "test-uuid",
      rows: [
        {
          registrations: "0"
        }
      ]
    }
  ]
};

jest.mock("@openmrs/esm-api", () => ({
  openmrsFetch: jest.fn().mockResolvedValueOnce(mockTableResponse)
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
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockTableResponse);
    const { queryByText } = render(
      <TableLoader {...commonWidgetProps} config={mockTableData} />
    );
    expect(queryByText("Loading...")).not.toBeNull();
    done();
  });

  it(`should render response as table with valid report response`, done => {
    mockEsmAPI.openmrsFetch.mockResolvedValueOnce(mockTableResponse);
    const { container, getByText } = render(
      <TableLoader {...commonWidgetProps} config={mockTableData} />
    );

    expect(container.getElementsByClassName("ReactModalPortal")).toBeTruthy();

    waitForElement(() => container.getElementsByClassName("ReactTable")).then(
      () => {
        expect(getByText("registrations")).toBeTruthy();
        done();
      }
    );
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
