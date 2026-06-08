import { pgTable, text, serial, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const doctorsTable = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  hospital: text("hospital").notNull(),
  county: text("county").notNull(),
  city: text("city").notNull().default("Monrovia"),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  consultationFee: real("consultation_fee").notNull().default(50),
  available: boolean("available").notNull().default(true),
  imageUrl: text("image_url"),
  bio: text("bio"),
  yearsExperience: integer("years_experience").notNull().default(5),
  languages: text("languages").array().notNull().default([]),
});

export const specialtiesTable = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull().default("stethoscope"),
  doctorCount: integer("doctor_count").notNull().default(0),
});

export const insertDoctorSchema = createInsertSchema(doctorsTable).omit({ id: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctorsTable.$inferSelect;

export const insertSpecialtySchema = createInsertSchema(specialtiesTable).omit({ id: true });
export type InsertSpecialty = z.infer<typeof insertSpecialtySchema>;
export type Specialty = typeof specialtiesTable.$inferSelect;
