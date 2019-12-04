import React from "react";

import RefAppGrid from "./refapp-grid.component";
import { render } from "@testing-library/react";
import buildColumn from "./column-builder";

describe("Refapp-Grid", () => {
  it("should show grid with columns", () => {
    const simpleColumns = [
      {
        cells: [
          {
            valueAccessor: "name",
            type: "label"
          }
        ]
      }
    ];
    const mockData = [
      {
        name: "test name"
      }
    ];

    const { getByText, container } = render(
      <RefAppGrid
        columns={simpleColumns.map(column => buildColumn(column))}
        data={mockData}
      />
    );

    expect(container.getElementsByClassName("ReactTable").length).toEqual(1);
    expect(getByText("test name")).toBeTruthy();
  });
});
