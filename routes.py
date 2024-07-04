from flask import Blueprint, request, jsonify
from your_event_controller_allocator import create_event, fetch_all_events, fetch_event_by_id, modify_event, remove_event

event_notification_blueprint = Blueprint('event_notification_blueprint', __name__)

@event_notification_blueprint.route('/events', methods=['POST'])
def add_new_event():
    event_details = request.get_json()
    return create_event(event_details)

@event_notification_blueprint.route('/events', methods=['GET'])
def retrieve_all_events():
    return jsonify(fetch_all_events())

@event_notification_blueprint.route('/events/<string:event_id>', methods=['GET'])
def retrieve_specific_event(event_id):
    return jsonify(fetch_event_by_id(event_id))

@event_notification_blueprint.route('/events/<string:event_id>', methods=['PUT'])
def update_specific_event(event_id):
    updated_event_details = request.get_json()
    return modify_event(event_id, updated_event_details)

@event_notification_blueprint.route('/events/<string:event_id>', methods=['DELETE'])
def delete_specific_activity(event_id):
    return remove_event(event_id)