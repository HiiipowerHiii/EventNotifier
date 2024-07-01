from flask import Blueprint, request, jsonify
from your_event_controller_module import create_event, get_all_events, get_event_by_id, update_event, delete_event
import os

events_bp = Blueprint('events_bp', __name__)

@events_bp.route('/events', methods=['POST'])
def add_event():
    data = request.get_json()
    return create_event(data)

@events_bp.route('/events', methods=['GET'])
def retrieve_events():
    return jsonify(get_all_events())

@events_bp.route('/events/<string:event_id>', methods=['GET'])
def retrieve_event(event_id):
    return jsonify(get_event_by_id(event_id))

@events_bp.route('/events/<string:event_id>', methods=['PUT'])
def update_an_event(event_id):
    data = request.get_json()
    return update_event(event_id, data)

@events_bp.route('/events/<string:event_id>', methods=['DELETE'])
def delete_an_event(event_id):
    return delete_event(event_id)