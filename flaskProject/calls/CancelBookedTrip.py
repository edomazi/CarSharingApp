from flask_restful import Resource
from flask import jsonify, request

from DatabaseStatements.DBQueries import SelectSeatsNumber, UpdateNumberOfSeats, DeleteUserBookedTrip
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class CancelBookedTrip(Resource):
    @jwt_required
    def post(self):

        data_form = request.form
        trip_id = data_form.get('tripId')
        identity_from_token = get_jwt_identity()

        try:
            con = DBConnection()

            seats = con.execute_query_params(SelectSeatsNumber, (identity_from_token['id'], trip_id))
            con.execute_insert_query(DeleteUserBookedTrip, (identity_from_token['id'], trip_id))
            seats = -seats[0][0]

            con.execute_insert_query(UpdateNumberOfSeats, (seats, trip_id))

            return jsonify(ok=1, message='Booked trip deleted successfully')

        except:
            return jsonify(ok=0, message='Something went wrong!')

    def get(self):
        return '', 404