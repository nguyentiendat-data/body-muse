import type { SVGProps } from "react";
const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6", search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0", bag: "M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2", user: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0", menu: "M4 6h16M4 12h16M4 18h16", close: "m6 6 12 12M6 18 18 6", check: "m5 12 4 4L19 6", truck: "M1 3h14v13H1V3Zm14 5h4l4 4v4h-8M7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z", box: "m12 3 9 5v9l-9 5-9-5V8l9-5Zm0 10v9M3 8l9 5 9-5M7 5l10 6", grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z", chart: "M3 3v18h18M7 14l4-5 4 3 6-8", star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z", mail: "M3 5h18v14H3V5Zm0 0 9 8 9-8", logout: "M9 4H3v16h6m5-12 4 4-4 4m-5-4h13", external: "M14 3h7v7m0-7L10 14M10 3H3v18h18v-7", filter: "M4 7h16M7 12h10M10 17h4", chevron: "m8 5 7 7-7 7", shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 10 3 3 5-6"
};
export type IconName = keyof typeof paths;
export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
