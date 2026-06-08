import { pgTable, text, serial, integer, real, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const workoutsTable = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // cardio, strength, flexibility, sports
  duration: integer("duration").notNull(), // minutes
  caloriesBurned: integer("calories_burned"),
  date: date("date", { mode: "string" }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const nutritionLogsTable = pgTable("nutrition_logs", {
  id: serial("user_id").primaryKey(),
  userId: integer("user_id_fk").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  foodName: text("food_name").notNull(),
  calories: integer("calories"),
  protein: real("protein"),
  carbs: real("carbs"),
  fat: real("fat"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const fitnessGoalsTable = pgTable("fitness_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // weight_loss, muscle_gain, endurance, flexibility
  targetValue: real("target_value"),
  currentValue: real("current_value"),
  unit: text("unit"),
  targetDate: date("target_date", { mode: "string" }),
  achieved: boolean("achieved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const stepsLogsTable = pgTable("steps_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  steps: integer("steps").notNull().default(0),
  distanceKm: real("distance_km"),
  activeMinutes: integer("active_minutes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workoutsTable).omit({ id: true, createdAt: true });
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workoutsTable.$inferSelect;
