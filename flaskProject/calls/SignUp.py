from flask_restful import Resource
from flask import request, jsonify
from utils.DBConnection import DBConnection
import bcrypt
from utils.SendEmail import SendEmail

from DatabaseStatements.DBQueries import InsertNewUsers, SelectUserByEmail
import secrets


class SignUp(Resource):
    def post(self):
        data_form = request.form

        first_name = data_form.get("first_name")
        last_name = data_form.get('last_name')
        email = data_form.get('email')
        password = data_form.get('password')

        try:
            con = DBConnection()
            # verify is user already exists by email else create new account
            user = con.execute_query_params(SelectUserByEmail, (email,))
            if len(user) and user[0][0] > 0:
                return jsonify(ok=0, message='User already exist')
            else:
                pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10))
                registration_token = secrets.token_hex(16)
                con.execute_insert_query(InsertNewUsers, (first_name, last_name, email, pw_hash, 0, registration_token))

                link = "http://localhost:3000/signin?token=%s" % registration_token
                mail_subject = "Carrental - Registration Mail"
                mail_body = '''Hello,
                                <div>
                                    Please use the following link <a href='%s'> %s </a> to confirm your registration!
                                </div>
                                <div>
                                    Best regards
                                 </div>''' % (link, link)

                SendEmail(mail_subject, mail_body, email)
                return jsonify(ok=1, message='Check your email to activate your account')
        except:
            return jsonify(ok=0, message='Something went wrong, please try again')

    def get(self):
        return '', 404
