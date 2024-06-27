from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from telegram import Bot
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://localhost/mydatabase')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)

db.create_all()

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
    new_event = Event(name=data['name'])
    db.session.add(new_event)
    db.session.commit()
    bot.send_message(chat_id=os.environ['TELEGRAM_CHAT_ID'], text=f"New event created: {data['name']}")
    return jsonify({"message": "Event created successfully"}), 201

@app.route('/events', methods=['GET'])
def get_events():
    events_list = Event.query.all()
    events = [{"id": event.id, "name": event.name} for event in events_list]
    return jsonify(events), 200

@app.route('/telegram', methods=['POST'])
def handle_telegram():
    data = request.json
    bot.send_message(chat_id=os.environ['TELEGRAM_CHAT_ID'], text="Received your message!")
    return jsonify({"wmessage": "Notification sent."}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)