import { pgTable, text, serial, timestamp, integer, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("MAWIBO User"),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().default(""),
  county: text("county").notNull().default("Montserrado"),
  city: text("city").notNull().default("Monrovia"),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
  gender: text("gender"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const healthProfilesTable = pgTable("health_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bloodGroup: text("blood_group"),
  height: real("height"),
  weight: real("weight"),
  allergies: text("allergies").array().notNull().default([]),
  chronicConditions: text("chronic_conditions").array().notNull().default([]),
  healthScore: integer("health_score").notNull().default(72),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const insertHealthProfileSchema = createInsertSchema(healthProfilesTable).omit({ id: true, updatedAt: true });
export type InsertHealthProfile = z.infer<typeof insertHealthProfileSchema>;
export type HealthProfile = typeof healthProfilesTable.$inferSelect;
