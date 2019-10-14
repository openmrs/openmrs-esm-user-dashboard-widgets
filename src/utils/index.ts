import { func } from "prop-types";

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
