import replaceParams from "./param-replacers";

describe("param-replacers", () => {
  it("should replace %Today% placeholder with current date", () => {
    const rawText = "test-url/%Today%",
      expectedText = `test-url/${
        new Date().toISOString().split("T")[0]
      }T00:00:00.000Z`;

    expect(replaceParams(rawText)).toEqual(expectedText);
  });
});
