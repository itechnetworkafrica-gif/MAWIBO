import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const familyMembersTable = pgTable("family_members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  phone: text("phone"),
  medicalConditions: text("medical_conditions").array().notNull().default([]),
  allergies: text("allergies").array().notNull().default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const healthGoalsTable = pgTable("health_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // fitness, nutrition, sleep, medication, mental
  targetDate: date("target_date", { mode: "string" }),
  status: text("status").notNull().default("active"), // active, completed, paused
  progress: integer("progress").notNull().default(0), // 0-100
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembersTable).omit({ id: true, createdAt: true });
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type FamilyMember = typeof familyMembersTable.$inferSelect;

export const insertHealthGoalSchema = createInsertSchema(healthGoalsTable).omit({ id: true, createdAt: true });
export type InsertHealthGoal = z.infer<typeof insertHealthGoalSchema>;
export type HealthGoal = typeof healthGoalsTable.$inferSelect;
