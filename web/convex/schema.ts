import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
export default defineSchema({
  ...authTables,
  assessments: defineTable({
    targetAccent: v.string(), spokenText: v.string(), userDescription: v.optional(v.string()),
    overallScore: v.number(), clarity: v.number(), naturalness: v.number(),
    issues: v.array(v.object({ sound: v.string(), problem: v.string(), exercise: v.string() })),
    tips: v.array(v.string()), createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
