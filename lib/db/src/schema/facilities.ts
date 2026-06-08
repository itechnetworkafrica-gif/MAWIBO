import { pgTable, text, serial, integer, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hospitalsTable = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("Hospital"),
  county: text("county").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address").notNull(),
  rating: real("rating").notNull().default(4.0),
  reviewCount: integer("review_count").notNull().default(0),
  services: text("services").array().notNull().default([]),
  departments: text("departments").array().notNull().default([]),
  imageUrl: text("image_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  emergencyAvailable: boolean("emergency_available").notNull().default(false),
  openNow: boolean("open_now").notNull().default(true),
});

export const pharmaciesTable = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  county: text("county").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  openNow: boolean("open_now").notNull().default(true),
  deliveryAvailable: boolean("delivery_available").notNull().default(false),
  rating: real("rating").notNull().default(4.0),
});

export const medicinesTable = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  category: text("category").notNull(),
  price: real("price").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  requiresPrescription: boolean("requires_prescription").notNull().default(false),
  description: text("description"),
});

export const labsTable = pgTable("labs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  county: text("county").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  rating: real("rating").notNull().default(4.0),
  homeCollectionAvailable: boolean("home_collection_available").notNull().default(false),
  tests: text("tests").array().notNull().default([]),
});

export const insertHospitalSchema = createInsertSchema(hospitalsTable).omit({ id: true });
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitalsTable.$inferSelect;

export const insertPharmacySchema = createInsertSchema(pharmaciesTable).omit({ id: true });
export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;
export type Pharmacy = typeof pharmaciesTable.$inferSelect;

export const insertMedicineSchema = createInsertSchema(medicinesTable).omit({ id: true });
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicinesTable.$inferSelect;

export const insertLabSchema = createInsertSchema(labsTable).omit({ id: true });
export type InsertLab = z.infer<typeof insertLabSchema>;
export type Lab = typeof labsTable.$inferSelect;
