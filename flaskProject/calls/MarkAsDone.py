from flask_restful import Resource
from flask import jsonify, request

from DatabaseStatements.DBQueries import MarkBookedTripAsDone, MarkTripAsDone
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required


class MarkAsDone(Resource):
    @jwt_required
    def post(self):

        data_form = request.form
        trip_id = data_form.get('tripId')

        try:
            con = DBConnection()
            con.execute_insert_query(MarkBookedTripAsDone, (trip_id,))
            con.execute_insert_query(MarkTripAsDone, (trip_id,))

            return jsonify(ok=1, message='Trip completed!')

        except:
            return jsonify(ok=0, message='Something went wrong!')

    def get(self):
        return '', 404
