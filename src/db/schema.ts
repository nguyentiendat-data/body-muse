import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { Notes } from "@/types/api";

export const orderStatus = pgEnum("order_status", [
  "new",
  "shipping",
  "done",
  "cancelled",
]);
export const reviewStatus = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);
export const orderNumber = pgSequence("order_number", { startWith: 1 });
const created = () =>
  timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const utm = () => ({
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
});
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  line: text("line").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  scent: text("scent").notNull(),
  size: text("size").notNull(),
  priceVnd: integer("price_vnd").notNull(),
  unitPriceVnd: integer("unit_price_vnd"),
  unitBasis: text("unit_basis"),
  notes: jsonb("notes").$type<Notes>(),
  stock: integer("stock").default(50).notNull(),
  image: text("image"),
  isActive: boolean("is_active").default(true).notNull(),
});
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: created(),
});
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique().notNull(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  note: text("note"),
  paymentMethod: text("payment_method").notNull(),
  status: orderStatus("status").default("new").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  discount: integer("discount").notNull(),
  total: integer("total").notNull(),
  couponCode: text("coupon_code"),
  ...utm(),
  createdAt: created(),
});
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  nameSnapshot: text("name_snapshot").notNull(),
  priceSnapshot: integer("price_snapshot").notNull(),
  qty: integer("qty").notNull(),
  scent: text("scent"),
});
export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  ...utm(),
  createdAt: created(),
});
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  stars: integer("stars").notNull(),
  name: text("name").notNull(),
  body: text("body").notNull(),
  status: reviewStatus("status").default("pending").notNull(),
  reply: text("reply"),
  createdAt: created(),
});
export const quizResults = pgTable("quiz_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  answers: jsonb("answers").$type<number[]>().notNull(),
  scent: text("scent").notNull(),
  ...utm(),
  createdAt: created(),
});
export const otpCodes = pgTable("otp_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull(),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: created(),
});
// Durable limits and one-use reset tokens work across serverless instances.
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").default(1).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
export const resetTokens = pgTable("reset_tokens", {
  id: uuid("id").primaryKey(),
  phone: text("phone").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});
