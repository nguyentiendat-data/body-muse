import { captureUtm } from "./utm";
export const isMock = process.env.NEXT_PUBLIC_USE_MOCK === "1";
export async function request<T>(
  path: string,
  data?: Record<string, unknown>,
): Promise<T> {
  const input = data ? { ...data, utm: captureUtm() } : undefined;
  if (isMock) {
    const { mockRequest } = await import("./mock");
    return (await mockRequest(path, input)) as T;
  }
  const response = await fetch(path, {
    method: input ? "POST" : "GET",
    headers: input ? { "Content-Type": "application/json" } : undefined,
    body: input ? JSON.stringify(input) : undefined,
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.error?.message || "Yêu cầu chưa thành công. Vui lòng thử lại.",
    );
  return result;
}
