from flask_restful import Resource
from flask import request, jsonify

from DatabaseStatements.DBQueries import DoPayment
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class MakePayment(Resource):
    @jwt_required
    def post(self):
        data_form = request.form

        trip_id = data_form.get("tripId")

        try:
            identity_from_token = get_jwt_identity()
            con = DBConnection()

            con.execute_insert_query(DoPayment, (trip_id, identity_from_token['id']))

            return jsonify(ok=1, message='Congratulations! Trip has been paid')

        except:
            return jsonify(ok=0, message='Something when wrong, please try again')

    def get(self):
        return '', 404
