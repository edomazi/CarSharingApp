from flask_restful import Resource
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from utils.DBConnection import DBConnection
from DatabaseStatements.DBQueries import UpdateUserInfos


class UpdateUserInfo(Resource):
    @jwt_required
    def post(self):

        data_form = request.form

        first_name = data_form.get('firstName')
        last_name = data_form.get('lastName')
        city = data_form.get('city')
        country = data_form.get('country')
        phone_number = data_form.get('phoneNumber')
        age = data_form.get('age')
        driving_license = data_form.get('drivingLicense')

        try:
            identity_from_token = get_jwt_identity()

            con = DBConnection()
            con.execute_insert_query(UpdateUserInfos, (first_name, last_name, city, country, phone_number, age,
                                                       driving_license, identity_from_token['id']))

            return jsonify(ok=1, message='Informations updated successfully')


        except:
            return jsonify(ok=0, message='Something went wrong')


    def get(self):
        return '', 404
