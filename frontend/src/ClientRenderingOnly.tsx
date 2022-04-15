import { ElementType } from "react";

export function ClientRenderingOnly({ children, Element = "div" }: { children: any; Element?: ElementType }) {
  return <Element suppressHydrationWarning>{typeof window === "undefined" ? null : children}</Element>;
}
