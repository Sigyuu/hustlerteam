import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Extend the existing users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  totalScore: integer("total_score").default(0).notNull(),
  levelsCompleted: integer("levels_completed").default(0).notNull(),
  levelsCreated: integer("levels_created").default(0).notNull(),
});

// Game levels table
export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  publicId: text("public_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // "easy" | "medium" | "hard"
  authorId: integer("author_id").references(() => users.id),
  authorName: text("author_name").notNull(),
  blocks: json("blocks").notNull(), // GameBlock[]
  goal: json("goal").notNull(), // LevelGoal
  rating: integer("rating").default(0).notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  downloads: integer("downloads").default(0).notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User achievements table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
  progress: integer("progress").default(0).notNull(),
});

// Level ratings table
export const levelRatings = pgTable("level_ratings", {
  id: serial("id").primaryKey(),
  levelId: integer("level_id").references(() => levels.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Level completions table (to track user progress)
export const levelCompletions = pgTable("level_completions", {
  id: serial("id").primaryKey(),
  levelId: integer("level_id").references(() => levels.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  moveCount: integer("move_count").notNull(),
  timeSeconds: integer("time_seconds").notNull(),
});

// User saved levels (bookmarks)
export const savedLevels = pgTable("saved_levels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  levelId: integer("level_id").references(() => levels.id).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLevelSchema = createInsertSchema(levels).pick({
  publicId: true,
  name: true,
  description: true,
  difficulty: true,
  authorName: true,
  blocks: true,
  goal: true,
  isPublic: true,
});

export const insertLevelRatingSchema = createInsertSchema(levelRatings).pick({
  levelId: true,
  rating: true,
});

export const insertAchievementSchema = createInsertSchema(userAchievements).pick({
  achievementId: true,
  progress: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Level = typeof levels.$inferSelect;
export type InsertLevel = z.infer<typeof insertLevelSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertAchievementSchema>;
export type LevelRating = typeof levelRatings.$inferSelect;
export type InsertLevelRating = z.infer<typeof insertLevelRatingSchema>;
export type LevelCompletion = typeof levelCompletions.$inferSelect;
export type SavedLevel = typeof savedLevels.$inferSelect;

// Game data types
export const GameBlockSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  color: z.string(),
  type: z.enum(["movable", "fixed", "goal"]),
});

export const LevelGoalSchema = z.object({
  type: z.enum(["move_blocks", "pattern_match", "stack_height"]),
  targetPositions: z.array(z.object({
    x: z.number(),
    z: z.number(),
  })).optional(),
  requiredPattern: z.string().optional(),
  targetHeight: z.number().optional(),
});

export const GameLevelSchema = z.object({
  id: z.string(),
  publicId: z.string().optional(),
  name: z.string(),
  description: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  blocks: z.array(GameBlockSchema),
  goal: LevelGoalSchema,
  author: z.string().optional(),
  authorId: z.number().optional(),
  rating: z.number().optional(),
  downloads: z.number().optional(),
  createdAt: z.number().optional(),
});

export type GameBlock = z.infer<typeof GameBlockSchema>;
export type LevelGoal = z.infer<typeof LevelGoalSchema>;
export type GameLevel = z.infer<typeof GameLevelSchema>;
