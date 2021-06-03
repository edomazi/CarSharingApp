from flask_restful import Resource
from flask import request, jsonify
from flask_jwt_extended import create_access_token
import bcrypt

from utils.DBConnection import DBConnection
from DatabaseStatements.DBQueries import SelectUserByEmail


class SignIn(Resource):
    def post(self):
        data_form = request.form

        email = data_form.get('email')
        password = data_form.get('password')

        try:
            con = DBConnection()
            user = con.execute_query_params(SelectUserByEmail, (email,))

            if len(user) > 0:
                if user[0][5] == 0:
                    return jsonify(ok=0, message='Activate your account first')
                if bcrypt.checkpw(password.encode('utf-8'), user[0][4].encode('utf-8')):
                    access_token = create_access_token(identity={'email': user[0][3], 'id': user[0][0]}, expires_delta=False)
                    return jsonify(ok=1, message='Logged in successfuly', token=access_token)
                else:
                    return jsonify(ok=0, message='Wrong combination of email and password')
            else:
                return jsonify(ok=0, message='Please create an account first!')
        except:
            return jsonify(ok=0, message='Something went wrong')

    def get(self):
        return '', 404
