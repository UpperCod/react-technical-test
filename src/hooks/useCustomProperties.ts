import { Ref, useLayoutEffect } from "react";

export function useCustomProperties(
  ref: Ref<HTMLElement>,
  properties: { [prop: string]: string | number }
) {
  useLayoutEffect(() => {
    if (typeof ref === "object") {
      const entries = Object.entries(properties).map(([name, value]) => [
        "--" + name,
        value.toString(),
      ]);
      entries.forEach(([name, value]) =>
        ref?.current?.style?.setProperty(name, value)
      );
      return () => {
        entries.forEach(([name]) => ref?.current?.style?.removeProperty(name));
      };
    }
  }, [ref, properties]);
}
