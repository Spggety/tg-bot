import { Bot, webhookCallback } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN!);

bot.command("start", async (ctx) => {
  await ctx.reply("Бот на Next.js работает 🚀");
});

export const POST = webhookCallback(bot, "std/http");