import { initAndHook } from "./index";

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
});
