from flask import Blueprint, request, jsonify
from your_event_controller_allocator import (
    create_event, 
    get_all_events, 
    get_event_by_id, 
    update_event, 
    delete_event
)

event_notification_blueprint = Blueprint('event_notification', __name__)

@event_notification_blueprint.route('/events', methods=['POST'])
def add_event():
    event_data = request.get_json()
    return create_event(event_data)

@event_notification_blueprint.route('/events', methods=['GET'])
def retrieve_events():
    return jsonify(get_all_events())

@event_notification_blueprint.route('/events/<string:event_id>', methods=['GET'])
def retrieve_event(event_id):
    return jsonify(get_event_by_id(event_id))

@event_notification_blueprint.route('/events/<string:event_id>', methods=['PUT'])
def update_event_details(event_id):
    event_update_data = request.get_json()
    return update_event(event_id, event_update_data)

@event_notification_blueprint.route('/events/<string:event_id>', methods=['DELETE'])
def delete_event_by_id(event_id):
    return delete_event(event_id)