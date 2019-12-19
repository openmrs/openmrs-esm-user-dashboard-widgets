import { Condition } from "../models/index";
import { debug } from "webpack";

export const getField = (obj, path: string) => {
  if (!path) {
    return obj;
  }

  return path.split(".").reduce((extractedObj, fieldName) => {
    return extractedObj[fieldName];
  }, obj);
};

export const doesMatchConditions = (obj, conditions: Condition[]) =>
  conditions.every(condition => {
    function objectContains(innerObject, path) {
      return condition.values.indexOf(getField(innerObject, path)) >= 0;
    }
    //Todo: check condition base on type , Needs to be refactored
    if (condition.isArray) {
      const paths = condition.field.split(".");
      return obj[paths[0]].filter(innerObject =>
        objectContains(innerObject, paths[1])
      ).length;
    }
    return objectContains(obj, condition.field);
  });

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

export const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

export const addTestId = columns =>
  columns.map(column => ({
    ...column,
    getProps: () => ({ "data-test-id": column.id })
  }));
