from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message(s)',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

# Command handler functions
def start(update, context):
    """Send a message when the command /start is issued."""
    update.message.reply_text('Hi! Use "/set <seconds>" to set a timer.')

def help_command(update, context):
    """Send a message when the command /help is issued."""
    update.message.reply_text('Help!')

def echo(update, context):
    """Echo the user message."""
    update.message.reply_text(update.message.text)

def set_timer(update, context):
    """Adds a job to the queue."""
    chat_id = update.message.chat_id
    
    due = get_due_time_from_args(context.args)
    if due is None:
        update.message.reply_text('Usage: /set <seconds>')
        return

    schedule_timer(update, context, due, chat_id)

def get_due_time_from_args(args):
    """Extracts and validates the due time from command arguments."""
    try:
        due = int(args[0])
        if due < 0:
            return None
        return due
    except (IndexError, ValueError):
        return None

def schedule_timer(update, context, due, chat_id):
    """Schedule a timer with the JobQueue."""
    job_queue = context.job_queue
    job_queue.run_once(send_notification, due, context=chat_id, name=str(chat_id))
    update.message.reply_text(f'Timer successfully set for {due} seconds!')

def send_notification(context: CallbackContext):
    """Send the notification message upon timer completion."""
    job = context.job
    context.bot.send_message(job.context, text='Timer finished!')

# Error handling
def error(update, context):
    """Log Errors caused by Updates."""
    logger.warning(f'Update "{update}" caused error "{context.error}"')

# The main function where the bot is configured and started
def main():
    """Start the bot."""
    updater = Updater(TELEGRAM_BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    # Register command handlers
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help_command))
    dp.add_handler(CommandHandler("set", set_timer))
    dp.add_handler(MessageHandler(Filters.text, echo))

    # Register an error handler
    dp.add_error_handler(error)

    # Start the Bot
    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()