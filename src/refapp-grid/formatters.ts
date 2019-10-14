import cloneDeep from "lodash/clonedeep";

const formatters = {
  convertToTime: (dateTimevalue): string => {
    const hour = new Date(dateTimevalue).getHours();
    const minutes = new Date(dateTimevalue).getMinutes();
    const type = hour >= 12 ? "PM" : "AM";
    return `${String(hour % 12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${type}`;
  },
  suffix: (value, suffix): string => `${value}${suffix}`
};

export const getField = (obj, path: string) => {
  if (!path) {
    return obj;
  }

  return path.split(".").reduce((extractedObj, fieldName) => {
    return extractedObj[fieldName];
  }, obj);
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
  return formatters[formaterName](getField(source, field), [...args]);
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
