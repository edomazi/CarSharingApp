from flask_restful import Resource
from flask import jsonify

from DatabaseStatements.DBQueries import UpdateUserToDriver
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class UpdateToDriver(Resource):
    @jwt_required
    def post(self):
        con = DBConnection()

        try:
            identity_from_token = get_jwt_identity()
            con.execute_insert_query(UpdateUserToDriver, (identity_from_token['id'],))

            return jsonify(ok=1, message='Congratulations you can now offer rides!')

        except:
            return jsonify(ok=0, message='Something when wrong with driver')

    def get(self):
        return '', 404
