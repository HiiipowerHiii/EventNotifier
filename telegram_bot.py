from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import logging
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

def start(update, context):
    update.message.reply_text('Hi! Use "/set <seconds>" to set a timer.')

def help_command(update, context):
    update.message.reply_text('Help!')

def echo(update, context):
    update.message.reply_text(update.message.text)

def set_timer(update, context):
    chat_id = update.message.chat_id
    try:
        due = int(context.args[0])
        if due < 0:
            update.message.reply_text('Sorry, cannot set a timer in the past!')
            return

        job_queue = context.job_queue
        job_queue.run_once(send_notification, due, context=chat_id, name=str(chat_id))

        update.message.reply_text(f'Timer successfully set for {due} seconds!')

    except (IndexerError, ValueError):
        update.message.reply_text('Usage: /set <seconds>')

def send_notification(context):
    job = context.job
    context.bot.send_message(job.context, text='Timer finished!')

def error(update, context):
    logger.warning(f'Update "{update}" caused error "{context.error}"')

def main():
    updater = Updater(TELEGRAM_BOT_TOKEN, use_context=True)
    dp = updater.dispatcher

    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("help", help_command))
    dp.add_handler(CommandHandler("set", set_timer))
    dp.add_handler(MessageHandler(Filters.text, echo))

    dp.add_error_handler(error)

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()