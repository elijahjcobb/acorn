import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, time = 1000): T {
  const [state, setState] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(value);
    }, time);
    return () => clearTimeout(timeout);
  }, [value, time]);

  return state;
}
