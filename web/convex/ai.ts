import { action } from "./_generated/server";
import { v } from "convex/values";
export const assessAccent = action({
    args: { targetAccent: v.string(), spokenText: v.string(), userDescription: v.optional(v.string()) },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o", messages: [
                    {
                        role: "system", content: `You are AccentCoach, a speech and accent training expert. Analyze how well someone is speaking with a ${args.targetAccent} accent. Provide detailed pronunciation feedback and exercises. Output JSON:
{"overallScore":<1-10>,"clarity":<1-10>,"naturalness":<1-10>,"issues":[{"sound":"<specific sound/phoneme>","problem":"<what's wrong>","exercise":"<practice exercise>"}],"tips":[""]}` },
                    { role: "user", content: `Target accent: ${args.targetAccent}\nText spoken: "${args.spokenText}"${args.userDescription ? `\nSelf-assessment: ${args.userDescription}` : ''}` },
                ], temperature: 0.5, max_tokens: 2000, response_format: { type: "json_object" }
            }),
        });
        if (!r.ok) throw new Error(`API error`);
        return JSON.parse((await r.json() as any).choices?.[0]?.message?.content ?? "{}");
    },
});
