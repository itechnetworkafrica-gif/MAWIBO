import { pgTable, text, serial, integer, real, date, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const insurancePlansTable = pgTable("insurance_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  type: text("type").notNull(), // health, dental, vision, life
  coverage: text("coverage").array().notNull().default([]),
  monthlyPremium: real("monthly_premium").notNull(),
  annualDeductible: real("annual_deductible").notNull(),
  maxCoverage: real("max_coverage"),
  inNetworkCopay: real("in_network_copay"),
  description: text("description"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userInsuranceTable = pgTable("user_insurance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id"),
  planName: text("plan_name").notNull(),
  provider: text("provider").notNull(),
  memberId: text("member_id").notNull(),
  groupNumber: text("group_number"),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  status: text("status").notNull().default("active"),
  coverageDetails: jsonb("coverage_details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insuranceClaimsTable = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  insuranceId: integer("insurance_id").notNull(),
  claimNumber: text("claim_number").notNull(),
  serviceDate: date("service_date", { mode: "string" }).notNull(),
  provider: text("provider").notNull(),
  serviceType: text("service_type").notNull(),
  amount: real("amount").notNull(),
  approvedAmount: real("approved_amount"),
  status: text("status").notNull().default("pending"), // pending, approved, denied, paid
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInsurancePlanSchema = createInsertSchema(insurancePlansTable).omit({ id: true, createdAt: true });
export type InsertInsurancePlan = z.infer<typeof insertInsurancePlanSchema>;
export type InsurancePlan = typeof insurancePlansTable.$inferSelect;

export const insertUserInsuranceSchema = createInsertSchema(userInsuranceTable).omit({ id: true, createdAt: true });
export type InsertUserInsurance = z.infer<typeof insertUserInsuranceSchema>;
export type UserInsurance = typeof userInsuranceTable.$inferSelect;
