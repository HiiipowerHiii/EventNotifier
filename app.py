from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError
from telegram import Bot, TelegramError
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://localhost/mydatabase')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)


try:
    db.create_all()
except Exception as e:
    app.logger.error("Error creating database tables: %s", e)

bot = Bot(token=os.environ['TELEGRAM_BOT_TOKEN'])


@app.before_request
def before_request():
    if request.headers.get('Content-Type') == 'application/json':
        request.json = request.get_json()


@app.route('/')
def index():
    return "Welcome to the Flask server!"


@app.route('/events', methods=['POST'])
def create_event():
    data = request.json
    try:
        new_event = Event(name=data['name'])
        db.session.add(new_event)
        db.session.commit()
        try:
            bot.send_message(chat_id=os.environ['TELEGRAM_CHAT_ID'], text=f"New event created: {data['name']}")
        except TelegramError as e:
            app.logger.error("Error sending message via Telegram: %s", e)
            return jsonify({"error": "Failed to send notification on Telegram"}), 500
    except (SQLAlchemyError, KeyError) as e:
        db.session.rollback()
        app.logger.error("Error creating event: %s", e)
        return jsonify({"error": "Failed to create event"}), 400
    return jsonify({"message": "Event created successfully"}), 201


@app.route('/events', methods=['GET'])
def get_events():
    try:
        events_list = Event.query.all()
        events = [{"id": event.id, "name": event.name} for event in events_list]
    except SQLAlchemyError as e:
        app.logger.error("Error fetching events: %s", e)
        return jsonify({"error": "Failed to fetch events"}), 500
    return jsonify(events), 200


@app.route('/telegram', methods=['POST'])
def handle_telegram():
    data = request.json
    try:
        bot.send_message(chat_id=os.environ['TELEGRAM_CHAT_ID'], text="Received your message!")
    except TelegramError as e:
        app.logger.error("Error handling Telegram request: %s", e)
        return jsonify({"error": "Failed to send Telegram message"}), 500
    return jsonify({"message": "Notification sent."}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)