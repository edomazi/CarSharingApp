from flask_restful import Resource
from flask import jsonify, request

from DatabaseStatements.DBQueries import InsertReview
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity

class AddReview(Resource):
    @jwt_required
    def post(self):

        data_form = request.form

        trip_id = data_form.get('tripId')
        driver_id = data_form.get('driverId')
        review = data_form.get('review')
        rating = data_form.get('rating')

        try:
            con = DBConnection()
            identity_from_token = get_jwt_identity()
            con.execute_insert_query(InsertReview, (driver_id, identity_from_token['id'], trip_id, review, rating))

            return jsonify(ok=1, message='Review added successfully')

        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404
