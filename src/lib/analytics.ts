type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};
export function track(name: string, properties: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("bm_consent") !== "yes") return;
  } catch {
    return;
  }
  const client = window as AnalyticsWindow;
  client.gtag?.("event", name, { currency: "VND", ...properties });
  const map: Record<string, string> = {
    view_item: "ViewContent",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
  };
  client.fbq?.(map[name] ? "track" : "trackCustom", map[name] || name, {
    currency: "VND",
    ...properties,
  });
}
export function startAnalytics() {
  const client = window as AnalyticsWindow;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (ga && /^G-[A-Z0-9]+$/.test(ga) && !document.getElementById("bm-ga")) {
    client.dataLayer ??= [];
    // Google gtag expects the Arguments object in dataLayer.
    client.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      client.dataLayer!.push(arguments);
    };
    const script = document.createElement("script");
    script.id = "bm-ga";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
    document.head.append(script);
    client.gtag("js", new Date());
    client.gtag("config", ga);
  }
  if (pixel && /^\d+$/.test(pixel) && !document.getElementById("bm-meta")) {
    type Pixel = ((...args: unknown[]) => void) & {
      queue: unknown[][];
      callMethod?: (...args: unknown[]) => void;
      push?: unknown;
      loaded: boolean;
      version: string;
    };
    const fbq: Pixel = Object.assign(
      (...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
      },
      { queue: [] as unknown[][], loaded: true, version: "2.0" },
    );
    fbq.push = fbq;
    client.fbq = fbq;
    const script = document.createElement("script");
    script.id = "bm-meta";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.append(script);
    fbq("init", pixel);
    fbq("track", "PageView");
  }
}
