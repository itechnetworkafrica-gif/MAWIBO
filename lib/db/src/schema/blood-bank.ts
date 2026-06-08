import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bloodDonorsTable = pgTable("blood_donors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bloodGroup: text("blood_group").notNull(),
  county: text("county").notNull(),
  phone: text("phone").notNull(),
  lastDonation: date("last_donation", { mode: "string" }),
  donationCount: integer("donation_count").notNull().default(0),
  available: boolean("available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bloodRequestsTable = pgTable("blood_requests", {
  id: serial("id").primaryKey(),
  bloodGroup: text("blood_group").notNull(),
  unitsNeeded: integer("units_needed").notNull(),
  hospital: text("hospital").notNull(),
  county: text("county").notNull().default("Montserrado"),
  urgency: text("urgency").notNull().default("normal"),
  status: text("status").notNull().default("open"),
  patientName: text("patient_name"),
  contactPhone: text("contact_phone").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBloodDonorSchema = createInsertSchema(bloodDonorsTable).omit({ id: true, createdAt: true });
export type InsertBloodDonor = z.infer<typeof insertBloodDonorSchema>;
export type BloodDonor = typeof bloodDonorsTable.$inferSelect;

export const insertBloodRequestSchema = createInsertSchema(bloodRequestsTable).omit({ id: true, createdAt: true });
export type InsertBloodRequest = z.infer<typeof insertBloodRequestSchema>;
export type BloodRequest = typeof bloodRequestsTable.$inferSelect;
