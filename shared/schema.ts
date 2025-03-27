import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  email: text("email"),
  role: text("role"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  avatarUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Customer Schema
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  status: text("status").default("active"),
  address: text("address"),
  avatarUrl: text("avatar_url"),
  lastContact: timestamp("last_contact"),
  churnRisk: integer("churn_risk").default(0),
  totalRevenue: doublePrecision("total_revenue").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  name: true,
  company: true,
  email: true,
  phone: true,
  status: true,
  address: true,
  avatarUrl: true,
  lastContact: true,
  churnRisk: true,
  totalRevenue: true,
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  inventory: integer("inventory").default(0),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  inventory: true,
  status: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Pipeline Stage Schema
export const pipelineStages = pgTable("pipeline_stages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  color: text("color").default("#3B82F6"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPipelineStageSchema = createInsertSchema(pipelineStages).pick({
  name: true,
  order: true,
  color: true,
});

export type InsertPipelineStage = z.infer<typeof insertPipelineStageSchema>;
export type PipelineStage = typeof pipelineStages.$inferSelect;

// Deal Schema
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  customerId: integer("customer_id").notNull(),
  value: doublePrecision("value").notNull(),
  stageId: integer("stage_id").notNull(),
  ownerId: integer("owner_id"),
  expectedCloseDate: timestamp("expected_close_date"),
  probability: integer("probability").default(0),
  status: text("status").default("open"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDealSchema = createInsertSchema(deals).pick({
  title: true,
  customerId: true,
  value: true,
  stageId: true,
  ownerId: true,
  expectedCloseDate: true,
  probability: true,
  status: true,
  notes: true,
});

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;

// Task Schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  assignedTo: integer("assigned_to"),
  relatedTo: text("related_to"),
  relatedId: integer("related_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  status: true,
  priority: true,
  assignedTo: true,
  relatedTo: true,
  relatedId: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Support Ticket Schema
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  customerId: integer("customer_id"),
  assignedTo: integer("assigned_to"),
  priority: text("priority").default("medium"),
  status: text("status").default("open"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTicketSchema = createInsertSchema(tickets).pick({
  title: true,
  description: true,
  customerId: true,
  assignedTo: true,
  priority: true,
  status: true,
  category: true,
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

// Activity Schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  activityType: text("activity_type").notNull(),
  relatedTo: text("related_to"),
  relatedId: integer("related_id"),
  description: text("description"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  activityType: true,
  relatedTo: true,
  relatedId: true,
  description: true,
  metadata: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;
