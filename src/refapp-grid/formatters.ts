import cloneDeep from "lodash.clonedeep";

import { getField } from "../utils";

const formatters = {
  convertToTime: (source, dateTimevalue): string => {
    const hours = new Date(dateTimevalue).getHours();
    const minutes = new Date(dateTimevalue).getMinutes();
    const type = hours >= 12 ? "PM" : "AM";

    return `${String(hours == 12 ? hours : hours % 12).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")} ${type}`;
  },
  suffix: (source, text, suffix): string => `${text}${suffix}`,
  differenceInMins: (source, startTimeInMilliseconds, endTimeFieldName) => {
    const minuteInMilliSeconds = 1000 * 60;
    const startTime = new Date(startTimeInMilliseconds);
    const endTime = new Date(getField(source, endTimeFieldName));
    const differenceInMilliSeconds = Math.abs(
      endTime.getTime() - startTime.getTime()
    );

    return `${Math.floor(
      differenceInMilliSeconds / minuteInMilliSeconds
    )} mins`;
  }
};

const getParentField = (obj, path: string) => {
  if (!path) {
    return obj;
  }

  return getField(obj, trimLastPathSection(path));
};

const trimLastPathSection = (path: string): string =>
  path
    .split(".")
    .slice(0, path.split(".").length - 1)
    .join(".");

export const formatField = (source, field, formatter) => {
  const formaterName =
    typeof formatter === "string" ? formatter : formatter.name;
  const args = formatter.args ? formatter.args : [];
  return formatters[formaterName](source, getField(source, field), ...args);
};

export default function format(
  source: any,
  formatterConfigs: Formatter[]
): any {
  const clonnedSource = cloneDeep(source);
  formatterConfigs.forEach(config => {
    const parent = getParentField(clonnedSource, config.field);

    const formattedFieldName = config.formattedField
      ? config.formattedField
      : `${config.field}Formatted`;

    parent[formattedFieldName] = formatField(
      clonnedSource,
      config.field,
      config
    );
  });

  return clonnedSource;
}

type Formatter = {
  name: string;
  field: string;
  formattedField?: string;
  args?: any[];
};
