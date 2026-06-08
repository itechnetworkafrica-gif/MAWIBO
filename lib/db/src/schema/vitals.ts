import { pgTable, text, serial, integer, real, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vitalsTable = pgTable("vitals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  systolic: integer("systolic"),
  diastolic: integer("diastolic"),
  heartRate: integer("heart_rate"),
  bloodSugar: real("blood_sugar"),
  temperature: real("temperature"),
  oxygenSaturation: integer("oxygen_saturation"),
  weight: real("weight"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const waterLogsTable = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  amount: real("amount").notNull(),
  goal: real("goal").notNull().default(2.5),
  time: text("time").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const labBookingsTable = pgTable("lab_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  labId: integer("lab_id").notNull(),
  labName: text("lab_name").notNull(),
  testName: text("test_name").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  time: text("time").notNull(),
  status: text("status").notNull().default("scheduled"),
  homeCollection: boolean("home_collection").notNull().default(false),
  resultUrl: text("result_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVitalsSchema = createInsertSchema(vitalsTable).omit({ id: true, createdAt: true });
export type InsertVitals = z.infer<typeof insertVitalsSchema>;
export type Vitals = typeof vitalsTable.$inferSelect;

export const insertWaterLogSchema = createInsertSchema(waterLogsTable).omit({ id: true, createdAt: true });
export type InsertWaterLog = z.infer<typeof insertWaterLogSchema>;
export type WaterLog = typeof waterLogsTable.$inferSelect;

export const insertLabBookingSchema = createInsertSchema(labBookingsTable).omit({ id: true, createdAt: true });
export type InsertLabBooking = z.infer<typeof insertLabBookingSchema>;
export type LabBooking = typeof labBookingsTable.$inferSelect;
