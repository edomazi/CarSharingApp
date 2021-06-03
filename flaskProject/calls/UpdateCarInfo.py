from flask_restful import Resource
from flask import request, jsonify

from DatabaseStatements.DBQueries import InsertNewCar, UpdateCarInfos
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class UpdateCarInfo(Resource):
    @jwt_required
    def post(self):
        data_form = request.form

        car_id = data_form.get("id")
        car_manufacturer = data_form.get("manufacturer")
        car_model = data_form.get('model')
        car_color = data_form.get('color')
        car_size = data_form.get('size')

        try:
            identity_from_token = get_jwt_identity()
            con = DBConnection()

            if car_id != '':
                con.execute_insert_query(UpdateCarInfos, (car_manufacturer, car_model, car_color, car_size, car_id))
            else:
                con.execute_insert_query(InsertNewCar, (identity_from_token['id'], car_manufacturer, car_model, car_color, car_size))

            return jsonify(ok=1, message='Information updated')

        except:
            return jsonify(ok=0, message='Something when wrong with driver')

    def get(self):
        return '', 404
