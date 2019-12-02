import { CommonWidgetProps } from "../models";
import { compose } from ".";

const replaceParamRegEx = (paramName: String) =>
  new RegExp(`%${paramName}%`, "g");

const replaceToday = (rawText: string) => {
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  return rawText.replace(replaceParamRegEx("Today"), today);
};

const replaceFromObjectProps = (
  text: String,
  sourceObject: CommonWidgetProps
) => {
  if (!sourceObject) {
    return text;
  }

  return Object.keys(sourceObject).reduce(
    (replacedText, propertyName) =>
      replacedText.replace(
        replaceParamRegEx(propertyName),
        sourceObject[propertyName]
      ),
    text
  );
};

export default function replaceParams(
  rawText: string,
  contextProperties?: CommonWidgetProps
): string {
  const parameterReplacers = [replaceToday];

  const replaceConstants = text =>
    parameterReplacers.reduce(
      (modifiedText, replacer) => replacer(modifiedText),
      text
    );

  const replaceContextProperties = (text: String) =>
    replaceFromObjectProps(text, contextProperties);

  return compose(replaceConstants, replaceContextProperties)(rawText);
}
