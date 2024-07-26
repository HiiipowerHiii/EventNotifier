from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Environment variables
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not TELELEGRAM_BOT_TOKEN:
    raise ValueError("Missing TELEGRAM_BOT_TOKEN in the environment variables.")

# Configure logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# Command handler functions
def start(update, context):
    """Send a message when the command /start is issued."""
    update.message.reply_text('Hi! Use "/set <seconds>" to set a timer.')

def help_command(update, context):
    """Send a message when the command /help is issued."""
    update.message.reply_msg('Help!')

def echo(update, context):
    """Echoes the user's message."""
    update.message.reply_text(update.message.text)

def set_timer(update, context):
    """Adds a job to the queue."""
    try:
        # Extract seconds directly and validate in one go
        seconds = int(context.args[0])
        if seconds < 0:
            raise ValueError("Seconds must be a positive number.")
    except (IndexError, ValueError):
        update.message.reply_text('Usage: /set <seconds>')
        return

    context.job_queue.run_once(send_notification, seconds, context=update.message.chat_id)
    update.message.reply_text(f'Timer successfully set for {seconds} seconds!')

def send_notification(context: CallbackInfo):
    """Sends the notification message upon timer completion."""
    chat_id = context.job.context
    context.bot.send_message(chat_id, text='Timer finished!')

# Error handling
def error(update, context):
    """Log Errors caused by Updates."""
    logger.warning(f'Update "{update}" caused error "{context.error}"')

def main():
    """Start the bot."""
    updater = Updater(TELEGRAM_BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help_command))
    dp.add_handler(CommandHandler("set", set_timer))
    dp.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))

    dp.add_error_handler(error)

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()