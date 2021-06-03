from flask_restful import Resource
from flask import jsonify

from DatabaseStatements.DBQueries import SelectCarInfos
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity


class GetCarInfo(Resource):
    @jwt_required
    def post(self):

        try:
            identity_from_token = get_jwt_identity()
            con = DBConnection()

            car = con.execute_query_params(SelectCarInfos, (identity_from_token['id'],))
            if len(car) > 0:
                toReturn = dict({
                    "id": car[0][0],
                    "manufacturer": car[0][2],
                    "model": car[0][3],
                    "color": car[0][4],
                    "size": car[0][5],
                })

                return jsonify(ok=1, car=toReturn)

            else:
                return jsonify(ok=0, car={})

        except:
            return jsonify(ok=0, message='Something when wrong with driver')

    def get(self):
        return '', 404
