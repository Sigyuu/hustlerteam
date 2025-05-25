import type { Express } from "express";
import { z } from "zod";
import { levels, levelRatings, levelCompletions, userAchievements, savedLevels } from "@shared/gameSchema";
import { GameLevelSchema, InsertLevelSchema, InsertLevelRatingSchema } from "@shared/gameSchema";

// This would be replaced with actual database operations
// For now, using mock data for demonstration
const mockLevels = [
  {
    id: 1,
    publicId: "level-1",
    name: "Getting Started",
    description: "Learn the basics with this simple puzzle",
    difficulty: "easy",
    authorId: 1,
    authorName: "Tutorial",
    blocks: [
      { id: "block-1", x: 1, y: 0, z: 1, color: "#3B82F6", type: "movable" }
    ],
    goal: {
      type: "move_blocks",
      targetPositions: [{ x: 6, z: 6 }]
    },
    rating: 45,
    ratingCount: 12,
    downloads: 156,
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockUserAchievements = new Map();
const mockLevelRatings = new Map();

export function registerGameRoutes(app: Express) {
  // Get public levels
  app.get("/api/levels", async (req, res) => {
    try {
      const { difficulty, search, limit = "20", offset = "0" } = req.query;
      
      let filteredLevels = mockLevels.filter(level => level.isPublic);
      
      if (difficulty && difficulty !== "all") {
        filteredLevels = filteredLevels.filter(level => level.difficulty === difficulty);
      }
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredLevels = filteredLevels.filter(level => 
          level.name.toLowerCase().includes(searchTerm) ||
          level.description.toLowerCase().includes(searchTerm) ||
          level.authorName.toLowerCase().includes(searchTerm)
        );
      }
      
      const start = parseInt(offset as string);
      const end = start + parseInt(limit as string);
      const paginatedLevels = filteredLevels.slice(start, end);
      
      res.json({
        levels: paginatedLevels,
        total: filteredLevels.length,
        hasMore: end < filteredLevels.length
      });
    } catch (error) {
      console.error("Error fetching levels:", error);
      res.status(500).json({ error: "Failed to fetch levels" });
    }
  });

  // Get specific level by public ID
  app.get("/api/levels/:publicId", async (req, res) => {
    try {
      const { publicId } = req.params;
      const level = mockLevels.find(l => l.publicId === publicId);
      
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }
      
      // Increment download count
      level.downloads++;
      
      res.json(level);
    } catch (error) {
      console.error("Error fetching level:", error);
      res.status(500).json({ error: "Failed to fetch level" });
    }
  });

  // Create new level
  app.post("/api/levels", async (req, res) => {
    try {
      const levelData = InsertLevelSchema.parse(req.body);
      
      // In a real app, get user from session
      const userId = 1; // Mock user ID
      
      const newLevel = {
        id: mockLevels.length + 1,
        ...levelData,
        authorId: userId,
        rating: 0,
        ratingCount: 0,
        downloads: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockLevels.push(newLevel);
      
      res.status(201).json(newLevel);
    } catch (error) {
      console.error("Error creating level:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid level data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create level" });
      }
    }
  });

  // Rate a level
  app.post("/api/levels/:publicId/rate", async (req, res) => {
    try {
      const { publicId } = req.params;
      const { rating } = InsertLevelRatingSchema.parse(req.body);
      
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      
      const level = mockLevels.find(l => l.publicId === publicId);
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }
      
      // In a real app, get user from session
      const userId = 1; // Mock user ID
      const ratingKey = `${level.id}-${userId}`;
      
      const existingRating = mockLevelRatings.get(ratingKey);
      
      if (existingRating) {
        // Update existing rating
        const oldRating = existingRating.rating;
        const newTotal = (level.rating * level.ratingCount) - oldRating + rating;
        level.rating = Math.round(newTotal / level.ratingCount);
        
        mockLevelRatings.set(ratingKey, { 
          levelId: level.id, 
          userId, 
          rating, 
          createdAt: new Date() 
        });
      } else {
        // Add new rating
        const newTotal = (level.rating * level.ratingCount) + rating;
        level.ratingCount++;
        level.rating = Math.round(newTotal / level.ratingCount);
        
        mockLevelRatings.set(ratingKey, { 
          levelId: level.id, 
          userId, 
          rating, 
          createdAt: new Date() 
        });
      }
      
      res.json({ success: true, newRating: level.rating });
    } catch (error) {
      console.error("Error rating level:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid rating data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to rate level" });
      }
    }
  });

  // Record level completion
  app.post("/api/levels/:publicId/complete", async (req, res) => {
    try {
      const { publicId } = req.params;
      const { moveCount, timeSeconds } = req.body;
      
      const level = mockLevels.find(l => l.publicId === publicId);
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }
      
      // In a real app, get user from session
      const userId = 1; // Mock user ID
      
      // Record completion (in real app, save to database)
      console.log(`User ${userId} completed level ${level.id} in ${timeSeconds}s with ${moveCount} moves`);
      
      // Check for achievements
      const achievements = [];
      
      // First level completion
      if (!mockUserAchievements.has(`${userId}-level_complete`)) {
        achievements.push("level_complete");
        mockUserAchievements.set(`${userId}-level_complete`, true);
      }
      
      // Speed run achievement (less than 30 seconds)
      if (timeSeconds < 30 && !mockUserAchievements.has(`${userId}-speed_run`)) {
        achievements.push("speed_run");
        mockUserAchievements.set(`${userId}-speed_run`, true);
      }
      
      res.json({ 
        success: true, 
        achievements,
        stats: {
          moveCount,
          timeSeconds,
          personalBest: timeSeconds // In real app, compare with previous times
        }
      });
    } catch (error) {
      console.error("Error recording completion:", error);
      res.status(500).json({ error: "Failed to record completion" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      // In a real app, get user from session
      const userId = 1; // Mock user ID
      
      const userAchievements = Array.from(mockUserAchievements.entries())
        .filter(([key]) => key.startsWith(`${userId}-`))
        .map(([key, value]) => ({
          achievementId: key.split('-')[1],
          unlocked: value,
          unlockedAt: new Date()
        }));
      
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Update achievement progress
  app.post("/api/achievements/:achievementId/progress", async (req, res) => {
    try {
      const { achievementId } = req.params;
      const { progress } = req.body;
      
      // In a real app, get user from session
      const userId = 1; // Mock user ID
      
      // Update achievement progress (in real app, save to database)
      const key = `${userId}-${achievementId}`;
      mockUserAchievements.set(key, { progress, unlocked: false });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating achievement progress:", error);
      res.status(500).json({ error: "Failed to update achievement progress" });
    }
  });

  // Get user's created levels
  app.get("/api/user/levels", async (req, res) => {
    try {
      // In a real app, get user from session
      const userId = 1; // Mock user ID
      
      const userLevels = mockLevels.filter(level => level.authorId === userId);
      
      res.json(userLevels);
    } catch (error) {
      console.error("Error fetching user levels:", error);
      res.status(500).json({ error: "Failed to fetch user levels" });
    }
  });

  // Save/bookmark a level
  app.post("/api/levels/:publicId/save", async (req, res) => {
    try {
      const { publicId } = req.params;
      
      const level = mockLevels.find(l => l.publicId === publicId);
      if (!level) {
        return res.status(404).json({ error: "Level not found" });
      }
      
      // In a real app, get user from session and save to database
      const userId = 1; // Mock user ID
      
      res.json({ success: true, message: "Level saved to your collection" });
    } catch (error) {
      console.error("Error saving level:", error);
      res.status(500).json({ error: "Failed to save level" });
    }
  });
}
