import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), // Use Clerk's user ID or a UUID
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: varchar("owner_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  position: integer("position").notNull(), // For ordering boards/columns
  createdAt: timestamp("created_at").defaultNow(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  boardId: integer("board_id") // This board is acting as a column
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
