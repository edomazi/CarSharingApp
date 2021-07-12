from flask_restful import Resource
from flask import jsonify, request

from DatabaseStatements.DBQueries import DeleteTrip, SelectUsersFromCanceledTrip, GetDriverName, DeleteBookedTripWhenDeleteTrip
from utils.DBConnection import DBConnection
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.SendEmail import SendEmail


class CancelTrip(Resource):
    @jwt_required
    def post(self):

        data_form = request.form
        trip_id = data_form.get('tripId')
        identity_from_token = get_jwt_identity()

        try:
            con = DBConnection()
            emails = con.execute_query_params(SelectUsersFromCanceledTrip, (trip_id,))

            con.execute_insert_query(DeleteBookedTripWhenDeleteTrip, (trip_id,))
            con.execute_insert_query(DeleteTrip, (trip_id,))

            driver_name = con.execute_query_params(GetDriverName, (identity_from_token['id'],))
            list_of_emails = []
            if len(emails):
                for email in emails:
                    list_of_emails.append(email[0])

                mail_subject = "Carrental - Trip Canceled "
                mail_body = '''Hello,
                                <div>
                                    <p>We are sorry to inform you that <h3> %s %s </h3> has cancelled his trip.</p>
                                    <p>Sorry for the inconvenience</p>
                                </div>
                                <div>
                                    Best regards
                                 </div>''' % (driver_name[0][0], driver_name[0][1])

                SendEmail(mail_subject, mail_body, list_of_emails)

            return jsonify(ok=1, message='Trip has been deleted successfully!')

        except:
            return jsonify(ok=0, message='Something went wrong!')

    def get(self):
        return '', 404
