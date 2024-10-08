import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv

load_dotenv()

event_notifier_app = Flask(__name__)
event_notifier_app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('EVENT_NOTIFIER_DATABASE_URL')

database = SQLAlchemy(event_notifier_app)

logging.basicConfig(level=logging.INFO)

class Event(database.Model):
    __tablename__ = 'events'
    event_id = database.Column(database.Integer, primary_key=True)
    event_title = database.Column(database.String(255), nullable=False)
    event_description = database.Column(database.Text, nullable=True)
    event_date = database.Column(database.Date, nullable=False)
    event_time = database.Column(database.Time, nullable=False)

def log_events():
    events = Event.query.all()
    if events:
        for event in events:
            logging.info(f'Event ID: {event.event_id}, Title: {event.event_title}, Date: {event.event_
date}, Time: {event.event_time}')
    else:
        logging.info('No events found in the database.')

with event_notifier_app.app_context():
    database.create_all()
    log_events()