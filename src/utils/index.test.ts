import {
  initAndHook,
  getField,
  doesMatchConditions,
  filterByConditions,
  addTestId
} from "./index";

describe("Utils", () => {
  describe("initAndHook", () => {
    it("should call update function with property immediatly", () => {
      const testProperty = "test-value",
        testHookFunciton = jest.fn(),
        testUpdateFunction = jest.fn();

      initAndHook(testProperty, testHookFunciton, testUpdateFunction);

      expect(testUpdateFunction.mock.calls.length).toEqual(1);
    });
  });

  describe("getField", () => {
    it("should get value of the given field", () => {
      expect(getField({ testField: "test-value" }, "testField")).toEqual(
        "test-value"
      );
    });

    it("should get value of the given nested field", () => {
      expect(
        getField(
          { testChild: { testField: "test-value" } },
          "testChild.testField"
        )
      ).toEqual("test-value");
    });

    it("should get value inside array when using index", () => {
      expect(
        getField(
          { testChild: [{ testField: "test-value" }] },
          "testChild.0.testField"
        )
      ).toEqual("test-value");
    });
  });

  describe("doesMatchConditions", () => {
    it("should return true when any one value matches", () => {
      const obj = { testField: "matchingField" },
        matchingConditions = [
          {
            field: "testField",
            values: ["matchingField", "Non matching value"]
          }
        ];

      expect(doesMatchConditions(obj, matchingConditions)).toBeTruthy();
    });

    it("should return false when non of the value matches", () => {
      const obj = { testField: "test-value" },
        matchingConditions = [
          {
            field: "testField",
            values: ["Non matching value"]
          }
        ];

      expect(doesMatchConditions(obj, matchingConditions)).toBeFalsy();
    });
  });

  describe("filterByConditions", () => {
    it("should matching object which matches the condition", () => {
      const rawObjects = [
          { testField: "matching-field" },
          { testField: "non-matching-field" }
        ],
        matchingConditions = [
          {
            field: "testField",
            values: ["matching-field"]
          }
        ];

      const actual = filterByConditions(rawObjects, matchingConditions);

      expect(actual.length).toEqual(1);
      expect(actual[0].testField).toEqual("matching-field");
    });
  });

  describe("addTestId", () => {
    it("should add getProps function returning test-id", () => {
      const columns = [{ id: "test-id" }];

      const columnsWithTestId = addTestId(columns);

      expect(columnsWithTestId[0].getProps()["data-test-id"]).toEqual(
        "test-id"
      );
    });
  });
});
