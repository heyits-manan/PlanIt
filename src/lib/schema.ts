import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(), // Use Clerk's user ID or a UUID
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  name: varchar("name", { length: 255 }),
});

// Create role enum for workspace members
export const workspaceMemberRoleEnum = pgEnum("workspace_member_role", ["owner", "editor", "viewer"]);

export const workspaces = pgTable("workspaces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: varchar("owner_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  ownerName: varchar("owner_name", { length: 255 }),
  
});

// Separate table for workspace contributors/members
export const workspaceMembers = pgTable("workspace_members", {
  id: serial("id").primaryKey(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .references(() => users.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  role: workspaceMemberRoleEnum("role").notNull().default("editor"),
  invitedAt: timestamp("invited_at").defaultNow(),
  joinedAt: timestamp("joined_at"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, accepted, rejected
});

export const boards = pgTable("boards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  workspaceId: integer("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  position: integer("position").notNull(), // For ordering boards/columns
  createdAt: timestamp("created_at").defaultNow(),
  ownerName: varchar("owner_name", { length: 255 }),
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