from flask_restful import Resource
from flask import request, jsonify
from flask_jwt_extended import create_access_token

from utils.DBConnection import DBConnection
from DatabaseStatements.DBQueries import SelectUserByActivationToken, SetUserToActivated


class ValidateRegistrationToken(Resource):
    def post(self):
        data_form = request.form

        token = data_form.get('token')

        con = DBConnection()
        user = con.execute_query_params(SelectUserByActivationToken, (token,))

        if len(user) > 0:
            access_token = create_access_token(identity={'email': user[0][3], 'id': user[0][0]}, expires_delta=False)
            con.execute_insert_query(SetUserToActivated, (user[0][0],))
            return jsonify(ok=1, message='Logged in successfuly', token=access_token)
        else:
            return jsonify(ok=0, message='Token is not valid!')

    def get(self):
        return '', 404
