from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

from flask import Flask

event_notifier_app = Flask(__name__)
event_notifier_app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('EVENT_NOTIFIER_DATABASE_URL')
database = SQLAlchemy(event_notifier_app)

class Event(database.Model):
    event_id = database.Column(database.Integer, primary_key=True)
    event_title = database.Column(database.String(255), nullable=False)
    event_description = database.Column(database.Text, nullable=True)
    event_date = database.Column(database.Date, nullable=False)
    event_time = database.Column(database.Time, nullable=False)

with event_notifier_app.app_context():
    database.create_all()