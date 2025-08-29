import os, requests
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("BOT_ADMIN_ID", "0"))
BACKEND = os.getenv("BACKEND_BASE_URL", "")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🤖 PreopAI Bot listo. Usa /health para verificar API.")

async def health(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        r = requests.get(f"{BACKEND}/health", timeout=10)
        await update.message.reply_text(f"Backend: {r.json()}")
    except Exception as e:
        await update.message.reply_text(f"Error: {e}")

def main():
    if not BOT_TOKEN:
        raise RuntimeError("BOT_TOKEN no configurado")
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("health", health))
    app.run_polling()

if __name__ == "__main__":
    main()
