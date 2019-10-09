import { initI18n } from "./translations";

import { getMockInitConfigs } from "../../__mocks__/i18next-mock";
jest.mock("i18next", () => {
  return require("../../__mocks__/i18next-mock");
});

describe("Translation Utils", () => {
  describe("initI18n", () => {
    it("should init i18n with default settings", () => {
      const testResources = {
        en: {
          translations: {
            test: "test"
          }
        }
      };
      const testLanguage = "en";
      const testHook = jest.fn();

      initI18n(testResources, testLanguage, testHook);
      expect(getMockInitConfigs().length).toEqual(1);
    });
  });
});
