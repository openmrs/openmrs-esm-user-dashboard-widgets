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
