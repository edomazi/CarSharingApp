from flask_restful import Resource
from flask import request, jsonify

from DatabaseStatements.DBQueries import InsertTrip
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class InsertNewTrip(Resource):
    @jwt_required
    def post(self):

        identity_from_token = get_jwt_identity()

        data_form = request.form

        trip_from = data_form.get("from")
        trip_to = data_form.get('to')
        trip_date = data_form.get('date')
        trip_seats = data_form.get('seats')
        trip_price = data_form.get('price')
        trip_description = data_form.get('description')

        try:
            user_id = identity_from_token['id']

            con = DBConnection()

            con.execute_insert_query(InsertTrip, (user_id, trip_from, trip_to, trip_date, trip_price, trip_seats, trip_description, 0))

            return jsonify(ok=1, message='Trip inserted')

        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404