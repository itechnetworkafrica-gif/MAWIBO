import { pgTable, text, serial, integer, real, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const diseaseReportsTable = pgTable("disease_reports", {
  id: serial("id").primaryKey(),
  disease: text("disease").notNull(),
  county: text("county").notNull(),
  casesCount: integer("cases_count").notNull().default(0),
  deathsCount: integer("deaths_count").notNull().default(0),
  recoveredCount: integer("recovered_count").notNull().default(0),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
  reportDate: date("report_date", { mode: "string" }).notNull(),
  alertLevel: text("alert_level").notNull().default("normal"), // normal, watch, warning, emergency
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const outbreakAlertsTable = pgTable("outbreak_alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  disease: text("disease").notNull(),
  county: text("county").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  description: text("description").notNull(),
  recommendations: text("recommendations").array().notNull().default([]),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  active: integer("active").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDiseaseReportSchema = createInsertSchema(diseaseReportsTable).omit({ id: true, createdAt: true });
export type InsertDiseaseReport = z.infer<typeof insertDiseaseReportSchema>;
export type DiseaseReport = typeof diseaseReportsTable.$inferSelect;
