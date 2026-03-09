import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const saveAssessment = mutation({
  args: { targetAccent: v.string(), spokenText: v.string(), userDescription: v.optional(v.string()), overallScore: v.number(), clarity: v.number(), naturalness: v.number(), issues: v.array(v.object({ sound: v.string(), problem: v.string(), exercise: v.string() })), tips: v.array(v.string()) },
  handler: async (ctx, args) => await ctx.db.insert("assessments", { ...args, createdAt: Date.now() }),
});
export const getRecent = query({ args: {}, handler: async (ctx) => await ctx.db.query("assessments").order("desc").take(20) });
export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
