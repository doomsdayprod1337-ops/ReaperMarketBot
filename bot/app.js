import { Telegraf, Markup } from "telegraf";

const token = "7823172363:AAFf88xvbNX_47_GGuREBBIaHhWNCVZXSAI";
const webAppUrl = "https://clicker-bot-52e16.web.app";

const bot = new Telegraf(token);

bot.command("start", (ctx) => {
    ctx.reply(
        "Hello! Press to start the app",
        Markup.inlineKeyboard([
            Markup.button.webApp(
                "Open mini app",
                `${webAppUrl}?ref=${ctx.payload}`
            ),
        ])
    );
});

bot.launch();
