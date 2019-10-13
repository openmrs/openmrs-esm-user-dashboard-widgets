import buildColumn from "./column-builder";
import { act } from "@testing-library/react";

describe("Column Builder", () => {
  it("should return basic column details", () => {
    const actualColumn = buildColumn({
      id: "test-column-id",
      columns: ["test-column"]
    });
    expect(actualColumn.id).toEqual("test-column-id");
    expect(actualColumn.accessor).toEqual("test-column");
  });

  it("should return basic column details", () => {
    const actualColumn = buildColumn({
      id: "test-column-id",
      columns: ["test-column"]
    });
    expect(actualColumn.id).toEqual("test-column-id");
    expect(actualColumn.accessor).toEqual("test-column");
  });
});
