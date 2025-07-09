import {
  mysqlTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

// 🧑‍💼 Users table
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 10 }).default("press").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// 📰 News table
export const news = mysqlTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }),
  content: text("content").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  publishedAt: timestamp("publishedAt").defaultNow(),
  isBreaking: boolean("isBreaking").default(false),
  isSidebar: boolean("isSidebar").default(false),
  isFeatured: boolean("isFeatured").default(false),
  images: text("images"), // you can use JSON in your code to store an array
  tags: text("tags"), // same here – store JSON array if needed
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow().defaultNow(),
});

// 🏷️ Categories table
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  sidebar: boolean("sidebar").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow().defaultNow(),
});
