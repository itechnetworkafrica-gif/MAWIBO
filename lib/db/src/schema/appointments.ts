import { pgTable, text, serial, integer, real, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  doctorImageUrl: text("doctor_image_url"),
  specialty: text("specialty").notNull(),
  hospital: text("hospital").notNull().default(""),
  date: date("date", { mode: "string" }).notNull(),
  time: text("time").notNull(),
  type: text("type").notNull().default("in-person"),
  status: text("status").notNull().default("upcoming"),
  notes: text("notes"),
  fee: real("fee").notNull().default(50),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
