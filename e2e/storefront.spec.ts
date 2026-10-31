import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("bm_consent", "no"));
});
test("mua hàng, UTM và tra cứu đơn", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(
    "/?utm_source=facebook&utm_medium=social&utm_campaign=ra_mat",
  );
  await expect(
    page.getByRole("heading", {
      name: "Mùi hương của riêng bạn, từ đầu đến chân.",
    }),
  ).toBeVisible();
  await page.locator("img").evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (image) => {
        if (image instanceof HTMLImageElement) {
          image.loading = "eager";
          await image.decode();
        }
      }),
    );
  });
  await page.screenshot({
    path: `artifacts/${info.project.name}-home.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("link", { name: "Khám phá ngay", exact: true }).click();
  await page
    .getByRole("button", { name: "Thêm vào giỏ", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Đóng giỏ hàng" }).click();
  await page.locator("article").first().getByRole("link").click();
  await expect(
    page.getByRole("heading", { name: "Ba tầng hương" }),
  ).toBeVisible();
  await page.locator("main img").evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) =>
        image instanceof HTMLImageElement ? image.decode() : undefined,
      ),
    );
  });
  await page.screenshot({
    path: `artifacts/${info.project.name}-product.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: /Mở giỏ hàng/ }).click();
  await page.getByRole("link", { name: "Tiến hành thanh toán" }).click();
  await page.getByLabel("Họ và tên", { exact: true }).fill("Khách Demo");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0901234567");
  await page.getByLabel("Địa chỉ nhận hàng").fill("Địa chỉ minh họa cho đồ án");
  await page.getByLabel("Mã giảm giá").fill("WELCOME10");
  await page.getByRole("button", { name: "Áp dụng" }).click();
  await page.getByRole("button", { name: "Đặt đơn demo" }).click();
  await expect(
    page.getByRole("heading", { name: "Đã nhận đơn của bạn." }),
  ).toBeVisible();
  await expect(page.getByText("141.100đ", { exact: true })).toBeVisible();
  const utm = await page.evaluate(
    () => JSON.parse(localStorage.getItem("bm_mock_orders") || "[]")[0].utm,
  );
  expect(utm).toEqual({
    source: "facebook",
    medium: "social",
    campaign: "ra_mat",
  });
  await page
    .getByRole("link", { name: "Tra cứu đơn hàng", exact: true })
    .first()
    .click();
  await page.getByLabel("Mã đơn hàng").fill("BM-0001");
  await page.getByLabel("Số điện thoại đặt hàng").fill("0901234567");
  await page
    .getByRole("button", { name: "Tra cứu đơn hàng", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "BM-0001" })).toBeVisible();
  expect(errors).toEqual([]);
});
test("đăng ký, đăng nhập và OTP đổi mật khẩu", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0902223333");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Matkhau123");
  await page.getByLabel("Nhập lại mật khẩu").fill("Sai12345");
  await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
  await expect(page.locator("#confirmPassword-error")).toHaveText(
    "Mật khẩu nhập lại chưa khớp.",
  );
  await page.getByLabel("Nhập lại mật khẩu").fill("Matkhau123");
  await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
  await expect(page).toHaveURL(/\/shop/);
  if (
    await page.getByRole("button", { name: "Mở menu", exact: true }).isVisible()
  )
    await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Đăng xuất", exact: true })
    .filter({ visible: true })
    .click();
  await page.goto("/forgot-password");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0902223333");
  await page.getByRole("button", { name: "Gửi mã OTP", exact: true }).click();
  await page.getByLabel("Mã OTP 6 số").fill("123456");
  await page.getByRole("button", { name: "Xác nhận mã" }).click();
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill("Matkhaumoi456");
  await page.getByLabel("Nhập lại mật khẩu").fill("Matkhaumoi456");
  await page.getByRole("button", { name: "Đổi mật khẩu", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Đã đổi mật khẩu" }),
  ).toBeVisible();
  await page.goto("/login");
  await page.getByLabel("Số điện thoại", { exact: true }).fill("0902223333");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Matkhaumoi456");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/\/shop/);
});
test("trắc nghiệm chọn theo đa số", async ({ page }) => {
  await page.goto("/quiz");
  for (const answer of [
    "Cà phê và một cuốn sách",
    "Nắng nhẹ, trời trong",
    "Gọn gàng, sạch sẽ",
    "Đi học, đi làm",
    "Xanh cobalt",
  ])
    await page.getByRole("button", { name: answer, exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Daisy Blue", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Thêm cả 3 vào giỏ" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("717.000đ", { exact: true }),
  ).toBeVisible();
});
test("admin bị chặn và origin khác bị từ chối", async ({ request }) => {
  expect((await request.get("/admin")).status()).toBe(401);
  expect((await request.get("/api/admin/export?type=orders")).status()).toBe(
    401,
  );
  const result = await request.post("/api/orders", {
    headers: { origin: "https://other.example" },
    data: {},
  });
  expect(result.status()).toBe(400);
  expect((await result.json()).error.code).toBe("INVALID_ORIGIN");
});
