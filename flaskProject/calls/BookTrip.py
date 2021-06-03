from flask_restful import Resource
from flask import request, jsonify

from DatabaseStatements.DBQueries import UpdateNumberOfSeats, InsertBookedTripToUser
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class BookTrip(Resource):
    @jwt_required
    def post(self):

        identity_from_token = get_jwt_identity()

        data_form = request.form

        trip_id = data_form.get("tripId")
        seats_booked = data_form.get('bookedSeats')
        trip_price = data_form.get('tripPrice')
        driver_id = data_form.get('driverId')

        try:
            con = DBConnection()

            # check if the person booking is the driver, if yes dont book.
            if int(driver_id) == identity_from_token['id']:
                return jsonify(ok=0, message='You can\'t book your own trip')

            con.execute_insert_query(UpdateNumberOfSeats, (seats_booked, trip_id))

            con.execute_insert_query(InsertBookedTripToUser, (trip_id, identity_from_token['id'], trip_price, seats_booked, 0, 0))

            return jsonify(ok=1, message='Trip has been booked')

        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404