import { useState, useEffect, DependencyList, EffectCallback } from "react";

export function useDependencyEffect(
  handler: EffectCallback,
  deps: DependencyList
): void {
  const [skipCount, setSkipCount] = useState(true);
  useEffect(() => {
    let returnHandler: (() => void) | void = undefined;
    if (skipCount) setSkipCount(false);
    if (!skipCount) returnHandler = handler();
    if (returnHandler) return returnHandler();
  }, deps);
}
