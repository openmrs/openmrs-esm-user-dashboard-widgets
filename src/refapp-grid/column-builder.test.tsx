import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import buildColumn from "./column-builder";

describe("Column Builder", () => {
  afterEach(() => {
    cleanup();
  });
  it("should return empty column details", () => {
    const columnConfig = buildColumn({
      cells: []
    });

    const { container } = render(columnConfig.accessor({}));

    expect(columnConfig.id).toEqual("");
    expect(container.getElementsByTagName("div").length).toEqual(0);
  });

  it("should add dynamic id to column", () => {
    const actualColumn = buildColumn({
      cells: [
        {
          type: "label",
          valueAccessor: "name"
        },
        {
          type: "label",
          valueAccessor: "id"
        }
      ]
    });

    expect(actualColumn.id).toEqual("name-id");
  });

  it("should return multi cell column", () => {
    const actualColumn = buildColumn({
      cells: [
        {
          type: "label",
          valueAccessor: "name"
        },
        {
          type: "label",
          valueAccessor: "id"
        }
      ]
    });
    const rowData = { name: "test user", id: "0001" };

    const { getByText } = render(actualColumn.accessor(rowData));

    expect(getByText("test user")).toBeTruthy();
    expect(getByText("0001")).toBeTruthy();
  });

  it("should add given style to cells", () => {
    const actualColumn = buildColumn({
      cells: [
        {
          type: "label",
          valueAccessor: "name",
          styles: "test-label-style-1"
        },
        {
          type: "label",
          valueAccessor: "id",
          styles: "test-label-style-2"
        }
      ]
    });
    const rowData = { name: "test user", id: "0001" };

    const { getByText } = render(actualColumn.accessor(rowData));

    expect(getByText("test user")).toHaveClass("test-label-style-1");
    expect(getByText("0001")).toHaveClass("test-label-style-2");
  });

  it("should assign formatter to the cells", () => {
    const actualColumn = buildColumn({
      cells: [
        {
          type: "label",
          valueAccessor: "name",
          formatter: {
            name: "suffix",
            args: [" .Mr"]
          }
        }
      ]
    });
    const rowData = { name: "test user" };

    const { getByText } = render(actualColumn.accessor(rowData));

    expect(getByText("test user .Mr")).toBeTruthy();
  });

  it("should show button cell", () => {
    const actualColumn = buildColumn({
      cells: [
        {
          type: "button",
          label: "Submit",
          valueAccessor: "name"
        }
      ]
    });
    const rowData = { name: "test user" };

    const { getByText } = render(actualColumn.accessor(rowData));

    expect(getByText("Submit")).toBeTruthy();
  });

  it("should show color circle cell", () => {
    const actualColumn = buildColumn({
      cells: [
        {
          type: "colorCircle",
          valueAccessor: "color"
        }
      ]
    });
    const rowData = { color: "red" };

    const { container } = render(actualColumn.accessor(rowData));

    expect(container.firstChild).toHaveClass("circle");
    expect(container.firstChild).toHaveStyle("background: red");
  });
});
