import { pgTable, text, serial, integer, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vaccinationsTable = pgTable("vaccinations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  disease: text("disease").notNull(),
  dateAdministered: date("date_administered", { mode: "string" }).notNull(),
  nextDueDate: date("next_due_date", { mode: "string" }),
  provider: text("provider"),
  batchNumber: text("batch_number"),
  notes: text("notes"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const vaccinationScheduleTable = pgTable("vaccination_schedule", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  disease: text("disease").notNull(),
  recommendedAge: text("recommended_age").notNull(),
  doses: integer("doses").notNull().default(1),
  intervalWeeks: integer("interval_weeks"),
  description: text("description"),
  mandatory: boolean("mandatory").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVaccinationSchema = createInsertSchema(vaccinationsTable).omit({ id: true, createdAt: true });
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Vaccination = typeof vaccinationsTable.$inferSelect;
