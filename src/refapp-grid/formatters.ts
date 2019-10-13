import cloneDeep from "lodash/clonedeep";

const formatters = {
  convertToTime: (dateTimevalue): string => {
    const hour = new Date(dateTimevalue).getHours();
    const minutes = new Date(dateTimevalue).getMinutes();
    const type = hour >= 12 ? "PM" : "AM";
    return `${hour % 12}:${minutes} ${type}`;
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
  const formattedSource = cloneDeep(source);
  formatterConfigs.forEach(config => {
    const fieldValue = getField(formattedSource, config.field);
    const parent = getParentField(formattedSource, config.field);

    const formattedFieldName = config.formattedField
      ? config.formattedField
      : `${config.field}Formatted`;
    const formatterArgs = config.args ? config.args : [];
    parent[formattedFieldName] = formatters[config.name](fieldValue, [
      ...formatterArgs
    ]);
  });

  return formattedSource;
}

type Formatter = {
  name: string;
  field: string;
  formattedField?: string;
  args?: any[];
};
