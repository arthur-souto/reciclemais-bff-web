import {pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["USER", "ADMIN", "ASSOCIATE"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  cpf: varchar({length: 11}).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: userRole("role").default("USER").notNull(),
});

export type UserRow = typeof usersTable.$inferSelect;
export type NewUserRow = typeof usersTable.$inferInsert;