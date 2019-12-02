import replaceParams from "./param-replacers";
import { CommonWidgetProps } from "../models";

describe("param-replacers", () => {
  it("should replace %Today% placeholder with current date", () => {
    const rawText = "test-url/%Today%",
      expectedText = `test-url/${
        new Date().toISOString().split("T")[0]
      }T00:00:00.000Z`;

    expect(replaceParams(rawText)).toEqual(expectedText);
  });

  it("should replace parameters matching with context properties", () => {
    const rawText = "test-url/%provider%",
      expectedText = `test-url/test-provider-id`,
      testContext: CommonWidgetProps = {
        locale: "en",
        showMessage: () => {},
        provider: "test-provider-id"
      };

    expect(replaceParams(rawText, testContext)).toEqual(expectedText);
  });
});
