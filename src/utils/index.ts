import { Condition } from "../models/index";

export const getField = (obj, path: string) => {
  if (!path) {
    return obj;
  }

  return path.split(".").reduce((extractedObj, fieldName) => {
    return extractedObj[fieldName];
  }, obj);
};

export const doesMatchConditions = (obj, conditions: Condition[]) =>
  conditions.every(
    condition => condition.values.indexOf(getField(obj, condition.field)) >= 0
  );

export function initAndHook<T>(
  property: T,
  hook: Function,
  updateFn: (propety: T) => void
): void {
  updateFn(property);
  hook(() => {
    updateFn(property);
  }, [property]);
}

export function setErrorFilter(originalError, errorToFilter: RegExp) {
  //Todo: Upgrade to React Dom 16.9 to avoid below workaround to resolve "act" false positive
  console.error = (...args) => {
    if (errorToFilter.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
}

export const filterByConditions = (dataToFilter, conditions: Condition[]) =>
  dataToFilter.filter(data => doesMatchConditions(data, conditions));
