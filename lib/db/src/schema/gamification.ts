import { pgTable, text, serial, integer, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const healthCoinsTable = pgTable("health_coins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  balance: integer("balance").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const coinTransactionsTable = pgTable("coin_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // earn, spend
  reason: text("reason").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const badgesTable = pgTable("badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // fitness, medication, donation, social
  earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
});

export const dailyChallengesTable = pgTable("daily_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  challengeType: text("challenge_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").notNull().default(0),
  coinsReward: integer("coins_reward").notNull().default(10),
  completed: boolean("completed").notNull().default(false),
  date: date("date", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCoinTransactionSchema = createInsertSchema(coinTransactionsTable).omit({ id: true, createdAt: true });
export type InsertCoinTransaction = z.infer<typeof insertCoinTransactionSchema>;
export type CoinTransaction = typeof coinTransactionsTable.$inferSelect;
